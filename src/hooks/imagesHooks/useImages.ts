'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Image } from '@/types/images.types';


export const useImages = () => {
    const [loading, setloading] = useState(false);
    const [images, setImages] = useState<Image[]>([]);

    const fetchImages = useCallback(async () => {
        setloading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cargar las imágenes');
            }
            const data = await response.json();

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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<Image | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const createImage = useCallback(async (imageData: FormData) => {
        setLoading(true);
        setStatusMessage('Enviando archivos...');
        setSuccess(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, {
                method: 'POST',
                body: imageData,
                // credentials: 'include',
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

                if (event.data === 'Todos los archivos se guardaron exitosamente.') {
                    eventSource.close();
                    toast.success('Todos los archivos se guardaron exitosamente.')
                }
            }

            eventSource.onerror = (error) => {
                console.error("Error en la conexión del proceso", error);
                toast.error("Error en la conexión del proceso");
                eventSource.close();
            }
        } catch (error) {
            toast.error((error as Error).message || 'Error al crear la imagen');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { console.log(statusMessage) }, [statusMessage]);

    return { loading, success, statusMessage, createImage };
}