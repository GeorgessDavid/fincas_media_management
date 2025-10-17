import imageCompression from 'browser-image-compression';

export type StatusSetter = (msg: string) => void;

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 3840,
    useWebWorker: true,
    fileType: file.type,
    initialQuality: 0.9
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error al comprimir la imagen:', error);
    throw error;
  }
};

const derivePublicUrl = (uploadUrl: string): string => {
  try {
    const u = new URL(uploadUrl);
    const publicBase = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE || '').trim();
    let keyPath = u.pathname;
    const parts = keyPath.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const bucket = parts[0];
      if (!u.hostname.startsWith(bucket + '.')) {
        keyPath = '/' + parts.slice(1).join('/');
      }
    }
    if (publicBase) return publicBase.replace(/\/$/, '') + keyPath;
    return u.origin + keyPath;
  } catch {
    return uploadUrl.split('?')[0];
  }
};

export const uploadImagesWithPresign = async (
  imageData: FormData,
  setStatusMessage: StatusSetter
): Promise<boolean> => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL as string;
  const files = imageData.getAll('files').filter((f): f is File => f instanceof File);
  if (!files.length) return false; // signal caller to fallback

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let fileToUpload = file;

    // Comprimir si es imagen
    if (file.type.startsWith('image/')) {
      setStatusMessage(`Comprimiendo imagen ${i + 1} de ${files.length}...`);
      fileToUpload = await compressImage(file);
    }

    setStatusMessage(`Preparando ${file.name}...`);

    // Obtener URL prefirmada con credenciales
    const presignRes = await fetch(
      `${apiBase}/images/presign?filename=${encodeURIComponent(file.name)}&type=${encodeURIComponent(fileToUpload.type)}`,
      { 
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!presignRes.ok) {
      const errorData = await presignRes.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || `No se pudo obtener URL prefirmada (${presignRes.status})`);
    }
    
    const { processId, uploadUrl } = await presignRes.json();
    const publicUrl = derivePublicUrl(uploadUrl);

    // Conectar al EventSource para seguimiento del proceso (ruta corregida)
    const es = new EventSource(`${apiBase}/images/upload/status/${processId}`);

    await new Promise<void>((resolve, reject) => {
      let closed = false;
      const close = () => { if (!closed) { es.close(); closed = true; } };

      es.onmessage = (event) => {
        setStatusMessage(`[${file.name}] ${String(event.data)}`);
        if (event.data === 'completed') {
          close();
          resolve();
        }
      };

      es.onerror = (error) => {
        console.error('Error en la conexión del proceso', error);
        close();
        reject(new Error('Error en la conexión del proceso'));
      };

      (async () => {
        try {
          setStatusMessage(`[${file.name}] Subiendo...`);
          const putRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': fileToUpload.type },
            body: fileToUpload
          });
          if (!putRes.ok) throw new Error(`Fallo en subida (${putRes.status})`);

          setStatusMessage(`[${file.name}] Registrando...`);
          const regRes = await fetch(`${apiBase}/images/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ processId, filename: file.name, link: publicUrl })
          });
          
          if (!regRes.ok) {
            const errorData = await regRes.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(errorData.message || 'Error al registrar la imagen');
          }
          // wait for SSE 'completed'
        } catch (e) {
          close();
          reject(e as Error);
        }
      })();
    });
  }

  return true;
};

