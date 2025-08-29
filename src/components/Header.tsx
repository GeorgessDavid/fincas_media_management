'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Chip, Divider, Tooltip, IconButton, Stack } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
    return (
        <header className="w-full h-[6vh] flex items-center flex-col">
            {/* First Header */}
            <div className="bg-[var(--green)] w-full h-full flex justify-between items-center ">
                <Link href="https://www.fincasdeaconcagua.com.ar/" title="Ir a Fincas de Aconcagua" target="_blank"><Image src="/logo_white.png" className="w-[3rem] h-auto mx-4" alt="Logo" width={100} height={100} /></Link>
                <div className="flex justify-between w-auto items-center gap-2 mx-4">
                    <Tooltip title="Click para ver más detalles" arrow>
                        <Stack direction="row" spacing={1} className="cursor-pointer" sx={{color: 'white !important'}}>
                            <Chip clickable icon={<AccountCircleIcon sx={{color: 'white !important'}} />} label="Usuario" sx={{color: 'white !important'}} variant="outlined" />
                        </Stack>
                    </Tooltip>
                    <Divider variant='middle' orientation='vertical' flexItem className='bg-white' />
                    <Tooltip title="Cerrar sesión" arrow>
                        <IconButton>
                            <LogoutIcon className="text-white" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </header>
    );
}