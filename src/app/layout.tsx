import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { Header } from '@/components/index.cjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "FdA - Gestión de Medios",
  description: "Gestión de medios para FdA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <ToastContainer position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        toastStyle={{background: "#212529", minWidth:"400px", maxWidth: "800px", color:"#ffffff"}} />
        <Header />
        {children}
      </body>
    </html>
  );
}
