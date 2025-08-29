'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useLogin = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const login = (useCallback(async (user: string, password: string) => {
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user, password })
            });

            if (!res.ok) throw new Error("Error en la autenticación");
            
            setIsLogged(true);
            setSuccess(true);
            toast.success("Inicio de sesión exitoso");
        } catch (err) {
            if (err instanceof Error) toast.error(err.message)
            else toast.error("Algo salió mal.");
        }finally{
            setLoading(false);
            setTimeout(() => {
                setSuccess(false);
            }, 50000);
        }

    }, []))
    return { isLogged, loading, success, login };
}