'use client';

import { useState, useEffect } from 'react';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import { useLogin } from '@/hooks/index.cjs';
import { useForm } from 'react-hook-form';

const LoginBox = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading, success } = useLogin();
    const { register, handleSubmit } = useForm();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form
            onSubmit={handleSubmit(async(data) => {
                const { user, password } = data;
                try{
                    await login(user, password);
                }catch(err){
                    console.error(err);
                }
            })}
            className="w-[35rem] flex flex-col items-center m-4 p-12 gap-4 shadow-[0px_0px_10px_gray] backdrop-blur-xl bg-white/30 rounded">
            <Image src="/fincas_cut.svg" alt="Fincas Logo" width={100} height={100} />
            <h1 className="text-xl font-bold text-[var(--titles)]"> Bienvenido al sistema de gestión de medios</h1>
            <span className="text-xs">Debe iniciar sesión para continuar.</span>
            <TextField color='success' variant='outlined' type='text' label='Usuario' fullWidth {...register('user', { required: 'Debe introducir el nombre de usuario.'})} />
            <TextField color='success' variant='outlined' type={showPassword ? 'text' : 'password'} {...register('password', {required: 'Debe introducir una contraseña.'})}label='Contraseña' fullWidth slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                color="success"
                                className="mr-5"
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }
            }} />
            <Button variant='contained' color='success' className='w-[12rem]' loading={loading} type="submit" disabled={success}>Iniciar sesión</Button>
        </form>
    )
}

export default LoginBox;