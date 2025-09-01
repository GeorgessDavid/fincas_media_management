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