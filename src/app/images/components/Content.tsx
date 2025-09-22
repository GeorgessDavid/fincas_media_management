'use client';

import { useState } from 'react';
import { useImages, useCreateImage } from '@/hooks';
import AddIcon from '@mui/icons-material/Add';
import { Image, WrappedButton, Modal, DragDrop } from 'components';

export const Content = () => {
  const { images, loading } = useImages();
  const [open, setOpen] = useState(false);
  const { createImage, statusMessage, loading: creating } = useCreateImage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      console.log("No se seleccionaron archivos");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    console.log("Enviando archivos:", selectedFiles);
    createImage(formData);
  };


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
      <form id="subscription-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

        <Modal
          open={open}
          setOpen={setOpen}
          title="Agregar Imagen"
          sendAction="Agregar"
          status={statusMessage}
          loading={creating}
        >
          <DragDrop onFilesChange={setSelectedFiles} />

        </Modal>
      </form>
    </div>
  );
}