'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { Image } from '@/types/images.types';


export const useImages = () => {
    const [loading, setloading] = useState(false);
    const [images, setImages] = useState<Image[]>([]);

    const fetchImages = useCallback(async () => {
        setloading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images?max=1000&offset=0&recent=true`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cargar las imágenes');
            }
            const data = await response.json();
            console.log(data)
            setImages(data.images);
        } catch (error) {
            toast.error((error as Error).message || 'Error al cargar las imágenes');
        } finally {
            setloading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return { loading, images, fetchImages };
}

export const useCreateImage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

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

    const createImage = useCallback(async (imageData: FormData) => {
        setLoading(true);
        setStatusMessage('Comprimiendo imágenes...');
        setSuccess(null);

        try {
            const files = imageData.getAll('files') as File[];
            const compressedFormData = new FormData();

            // Comprimir cada imagen
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                if (file.type.startsWith('image/')) {
                    setStatusMessage(`Comprimiendo imagen ${i + 1} de ${files.length}...`);
                    const compressedFile = await compressImage(file);
                    compressedFormData.append('files', compressedFile, file.name);
                } else {
                    compressedFormData.append('files', file);
                }
            }

            // Copiar otros campos del FormData original
            for (const [key, value] of imageData.entries()) {
                if (key !== 'files') {
                    compressedFormData.append(key, value);
                }
            }

            setStatusMessage('Enviando archivos...');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, {
                method: 'POST',
                body: compressedFormData,
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Error al crear la imagen');

            const { processId } = await response.json();
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/images/upload/status/${processId}`);

            eventSource.onmessage = (event) => {

                try {
                    console.log(event.data);
                    setStatusMessage(event.data);
                } catch (error) {
                    console.error("Error al parsear el mensaje del servidor", error);
                }

                if (event.data === 'completed') {
                    eventSource.close();
                    toast.success('Todos los archivos se guardaron exitosamente.')
                    setStatusMessage('Todos los archivos se guardaron exitosamente.');
                    setLoading(false);
                    setSuccess(true);
                    setTimeout(() => setStatusMessage(''), 5000);
                    setTimeout(() => setSuccess(null), 5000);

                }
            }

            eventSource.onerror = (error) => {
                console.error("Error en la conexión del proceso", error);
                toast.error("Error en la conexión del proceso");
                eventSource.close();
                setLoading(false);
            }
        } catch (error) {
            toast.error((error as Error).message || 'Error al crear la imagen');
            setLoading(false);
        }
    }, []);

    return { loading, success, statusMessage, createImage };
}

export const useDeleteImage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<boolean>(false);

    const deleteImage = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Error al eliminar la imagen');

            await response.json();
            toast.success('Imagen eliminada exitosamente.');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            toast.error((error as Error).message || 'Error al eliminar la imagen');
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, success, deleteImage };
}