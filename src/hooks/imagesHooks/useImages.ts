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
        setStatusMessage('');
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
                    // console.log(event);
                    const data = JSON.parse(event.data);
                    console.log(data);
                    if (data === "end") {
                        setSuccess(data.data); // acá guardás el objeto Image que vino del back
                        setStatusMessage("Proceso completado");
                        eventSource.close();
                        setLoading(false);
                    } else if (data.status === "error") {
                        toast.error(data.message || "Error en el proceso");
                        eventSource.close();
                        setLoading(false);
                    } else {
                        setStatusMessage(event.data);
                    }
                } catch {
                    setStatusMessage(event.data);
                }
            } 
            eventSource.onerror = () => {
                toast.error("Error en la conexión del proceso");
                eventSource.close();
                setLoading(false);
            }
        } catch (error) {
            toast.error((error as Error).message || 'Error al crear la imagen');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { console.log(statusMessage)},[statusMessage]);

    return { loading, success, statusMessage, createImage };
}