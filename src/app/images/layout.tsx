import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Imágenes - FdA Media Management'
}

export default function ImagesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full p-8 flex justify-center flex-col">
            {children}
        </div>
    );
}
