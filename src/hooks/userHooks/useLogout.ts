'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, { method: 'POST', credentials: 'include' });
            router.refresh();
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};


