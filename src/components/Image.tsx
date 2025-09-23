'use client';

import { useState } from 'react';
import { Backdrop, Tooltip } from '@mui/material';
import { Modal } from 'components';
import CloseIcon from '@mui/icons-material/Close';

const Image = ({ alt, srcSet }: {alt: string, srcSet: string}) => {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const handleDeleteOpen = () => setDeleteOpen(true);

    return (
        <div className="relative hover_child">
            <img alt={alt} srcSet={srcSet} onClick={handleOpen} className="w-[325px] h-[325px] object-cover cursor-pointer z-10 transition-all duration-300 ease-in" />
            <Tooltip title="Eliminar" placement="bottom" arrow>
              <button className="absolute bg-red-400 top-[-1rem] right-[-0.825rem] rounded-full p-1 text-white opacity-0 transition-all duration-300 ease-in shadow-2xl cursor-pointer hover:bg-red-300" onClick={handleDeleteOpen}><CloseIcon /></button>
            </Tooltip>
            <Backdrop
                open={open}
                onClick={handleClose}
                sx={(theme) => ({
                    backgroundColor: '#212526d3', zIndex: theme.zIndex.drawer + 1000
                })}
            >
                <img className="w-auto h-[85vh] object-contain cursor-default filter-none" alt={alt} srcSet={srcSet} />
            </Backdrop>
            <Modal open={deleteOpen} setOpen={setDeleteOpen} title="Eliminar Imagen" sendAction="Eliminar" >
                <span>¿Estás seguro que deseas eliminar esta imagen?</span>
            </Modal>
        </div>
    );
}

export default Image;   