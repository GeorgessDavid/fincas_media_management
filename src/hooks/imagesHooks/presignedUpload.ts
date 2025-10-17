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

// Ya no necesitamos derivar la URL pública en el frontend,
// el backend se encargará de construirla con MEDIA_URL

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
    
    // El backend ahora devuelve también el 'key' que usaremos para registrar
    const { processId, uploadUrl, key } = await presignRes.json();

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
            // Enviar el 'key' en lugar del 'link' completo
            // El backend construirá el link usando MEDIA_URL
            body: JSON.stringify({ processId, filename: file.name, key })
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

