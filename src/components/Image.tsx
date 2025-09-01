'use client';

import { useState } from 'react';
import { Backdrop } from '@mui/material';

const Image = ({ alt, srcSet }: {alt: string, srcSet: string}) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    return (
        <>
            <img alt={alt} srcSet={srcSet} onClick={handleOpen} className="w-[325px] h-[325px] object-cover cursor-pointer z-10"/>
            <Backdrop
                open={open}
                onClick={handleClose}
                sx={(theme) => ({
                    backgroundColor: '#212526d3', zIndex: theme.zIndex.drawer + 1000
                })}
            >
                <img className="w-auto h-[85vh] object-contain cursor-default filter-none" alt={alt} srcSet={srcSet} />
            </Backdrop>
        </>
    );
}

export default Image;   