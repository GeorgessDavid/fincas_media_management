import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home - FdA Media Management'
}

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
        </div>
    );
}
