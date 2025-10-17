export type StatusSetter = (msg: string) => void;

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

  for (const file of files) {
    setStatusMessage(`Preparando ${file.name}...`);

    const presignRes = await fetch(
      `${apiBase}/images/presign?filename=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`,
      { method: 'GET', credentials: 'include' }
    );
    if (!presignRes.ok) throw new Error('No se pudo obtener URL prefirmada');
    const { processId, uploadUrl } = await presignRes.json();
    const publicUrl = derivePublicUrl(uploadUrl);

    const es = new EventSource(`${apiBase}/images/status/${processId}`);

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
            headers: { 'Content-Type': file.type },
            body: file
          });
          if (!putRes.ok) throw new Error(`Fallo en subida (${putRes.status})`);

          setStatusMessage(`[${file.name}] Registrando...`);
          const regRes = await fetch(`${apiBase}/images/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ processId, filename: file.name, link: publicUrl })
          });
          if (!regRes.ok) throw new Error('Error al registrar la imagen');
          // wait for SSE 'completed'
        } catch (e) {
          reject(e as Error);
        }
      })();
    });
  }

  return true;
};

