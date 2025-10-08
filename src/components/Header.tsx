'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Chip, Divider, Tooltip, IconButton, Stack } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogged } from '@/context/LoggedContext';
import { JSX } from 'react';
import ImageIcon from '@mui/icons-material/Image';


export default function Header() {
    const { logged, username } = useLogged();
    return (
        <header className="w-full flex items-center flex-col sticky top-0 z-50">
            <FirstHeader user={username} logged={logged} />
            {logged && <SecondHeader />}
        </header>
    );
}

const FirstHeader = ({ user, logged }: { user: string, logged: boolean }) => {
    return (
        <div className="bg-[var(--green)] py-3 px-2 w-full flex justify-between items-center ">
            <Link href="https://www.fincasdeaconcagua.com.ar/" title="Ir a Fincas de Aconcagua" target="_blank"><Image src="/logo_white.png" className="w-[3rem] h-auto mx-4" alt="Logo" width={100} height={100} /></Link>
            {logged && <div className="flex justify-between w-auto items-center gap-2 mx-4">
                <Tooltip title="Click para ver más detalles" arrow>
                    <Stack direction="row" spacing={1} className="cursor-pointer" sx={{ color: 'white !important' }}>
                        <Chip clickable icon={<AccountCircleIcon sx={{ color: 'white !important' }} />} label={user} sx={{ color: 'white !important' }} variant="outlined" />
                    </Stack>
                </Tooltip>
                <Divider variant='middle' orientation='vertical' flexItem className='bg-white' />
                <Tooltip title="Cerrar sesión" arrow>
                    <IconButton>
                        <LogoutIcon className="text-white" />
                    </IconButton>
                </Tooltip>
            </div>}
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