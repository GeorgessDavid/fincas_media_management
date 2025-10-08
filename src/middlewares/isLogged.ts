import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const isLogged = async (req?: NextRequest) => {
    try {
        let auth;
        
        // Si viene desde middleware, usar request.cookies
        if (req) {
            auth = req.cookies.get('auth');
        } else {
            // Si viene desde Server Component, usar cookies()
            const cookieStore = await cookies();
            auth = cookieStore.get('auth');
        }

        if (!auth) {
            return false; // No hay cookie válida
        }

        return true;
    } catch (error) {
        console.error('Error al verificar la sesión del usuario:', error);
        throw new Error("Error al verificar la sesión del usuario");
    }
};
