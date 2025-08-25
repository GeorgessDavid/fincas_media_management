'use client';

import { useState, useEffect } from 'react';
import { TextField, Button} from '@mui/material';

const LoginBox = () => {
    return (
        <div className="w-[35rem] flex flex-col m-4 p-4 gap-4 shadow-[0px_0px_10px_gray] backrdop:blur">
            <h1 className="text-xl font-bold"> Bienvenido al sistema de gestión de medios</h1>
            <span className="text-xs">Debe iniciar sesión para continuar.</span>
            <TextField color='success' variant='outlined' type='text' label='Usuario' />
            <TextField color='success' variant='outlined' type='password' label='Contraseña' />
            <Button variant='contained' color='success' className='w-[12rem]'>Iniciar sesión</Button>
        </div>
    )
}

export default LoginBox;