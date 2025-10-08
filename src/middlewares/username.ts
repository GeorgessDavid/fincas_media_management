import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const getUsername = async (req?: NextRequest) => {
    try {
        // Si viene desde middleware, usar request.cookies
        if (req) {
            const userName = req.cookies.get('username');
            return userName?.value || null;
        }
        
        // Si viene desde Server Component, usar cookies()
        const cookieStore = await cookies();
        const userName = cookieStore.get('username');
        return String(userName?.value) || null;
    } catch (error) {
        console.error('Error getting username cookie:', error);
        return null;
    }
};
