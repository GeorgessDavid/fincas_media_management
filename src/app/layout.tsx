import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { Header } from '@/components/index.cjs';
import { LoggedProvider } from '@/context/LoggedContext';
import { isLogged, getUsername } from '@/middlewares';
import "./globals.css";

export const metadata: Metadata = {
  title: "FdA - Gestión de Medios",
  description: "Gestión de medios para FdA",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let username: string | null = null;
  let logged: boolean = false;
  const id: string | number = '';

  try {
    username = await getUsername();
    logged = await isLogged();
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

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
          toastStyle={{ background: "#212529", minWidth: "400px", maxWidth: "800px", color: "#ffffff" }} />
        <LoggedProvider initialData={{ logged, id, username: username || '' }}>

          <Header />
        </LoggedProvider>
        {children}
      </body>
    </html>
  );
}
