'use client';
import Image from 'next/image';
import Link from 'next/link';
import { /* Chip, Divider,  */Tooltip, IconButton, /* Stack */ } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useLogged } from '@/context/LoggedContext';
import { useLogout } from '@/hooks';
import { JSX } from 'react';
import { Modal } from 'components';
import ImageIcon from '@mui/icons-material/Image';


export default function Header() {
    const { logged } = useLogged();

    return (
        <header className="w-full flex items-center flex-col sticky top-0 z-50">
            <FirstHeader logged={logged} />
            {logged && <SecondHeader />}
        </header>
    );
}

const FirstHeader = ({ logged }: { logged: boolean }) => {
    const [logoutOpen, setLogoutOpen] = useState<boolean>(false);
    const { logout } = useLogout();
    return (
        <div className="bg-[var(--green)] py-3 px-2 w-full flex justify-between items-center ">
            <Tooltip title="Ir a Fincas de Aconcagua" arrow placement="right">
                <Link href="https://www.fincasdeaconcagua.com.ar/" target="_blank"><Image src="/logo_white.png" className="w-[3rem] h-auto mx-4" alt="Logo" width={100} height={100} /></Link>
            </Tooltip>
            {logged && <div className="flex justify-between w-auto items-center gap-2 mx-4">
                <Tooltip title="Cerrar sesión" arrow>
                    <IconButton onClick={() => setLogoutOpen(true)} aria-label="logout">
                        <LogoutIcon className="text-white" />
                    </IconButton>
                </Tooltip>
            </div>}
            <Modal title="Cerrar Sesión" sendAction="Cerrar Sesión" open={logoutOpen} setOpen={setLogoutOpen} onConfirm={() => { logout(); setLogoutOpen(false); }} color="primary" >
                <p>¿Estás seguro que deseas cerrar sesión?</p>
            </Modal>
        </div>
    )
}

const SecondHeader = () => {
    return (
        <div className="bg-white w-full h-1/2 flex justify-start items-center gap-4 px-4 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <NavLink icon={<ImageIcon className="text-[#212529]" />} label="Imágenes" href="/images" />
        </div>
    )
}

const NavLink = ({ icon, label, href }: { icon: JSX.Element, label: string, href: string }) => {
    return (
        <Link href={href} className="flex items-center gap-2 cursor-pointer">
            {icon}
            <span className="relative text-[#212529] after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#212529] after:transition-all after:duration-300 hover:after:w-full">{label}</span>
        </Link>
    )
}