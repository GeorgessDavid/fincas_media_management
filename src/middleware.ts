import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone(); // Clona la URL para redirecciones
    const sessionCookie = req.cookies.get('auth'); // Verificar cookie de sesión

    // Redirigir al login si no hay sesión activa
    if (!sessionCookie) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Permitir el acceso si las validaciones pasan
    return NextResponse.next();
}

export const config = {
    matcher: ['/images/:path*'], // Rutas protegidas
};
