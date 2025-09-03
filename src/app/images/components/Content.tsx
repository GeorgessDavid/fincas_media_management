'use client';

import { useState } from 'react';
import { useImages } from '@/hooks';
import AddIcon from '@mui/icons-material/Add';
import { Image, WrappedButton, Modal } from 'components';

export const Content = () => {
  const { images, loading } = useImages();
  const [open, setOpen] = useState(false);
  

  return (
    <div>
      <div className="flex h-full gap-4 flex-wrap m-4 p-8 gallery z-10">
        {!loading &&
          images?.map((image) => (
            <div key={image?.id} className="flex-shrink-0">
              <Image srcSet={image?.link} alt={image?.title} />
            </div>
          ))
        }
      </div>
      <WrappedButton
        icon={<AddIcon />}
        title="Agregar Imagen"
        text="Agregar Imagen"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        setOpen={setOpen}
        title="Agregar Imagen"
        sendAction="Agregar"
      >
        <input type="file" />
      </Modal>
    </div>
  );
}