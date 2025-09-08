'use client';

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';

export default function DragAndDrop() {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] }, // opcional: solo imágenes
        multiple: true,
    });

    return (
        <div className="p-4">
            {/* Zona de drop */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 rounded-lg cursor-pointer 
        ${isDragActive ? "bg-green-100 border-green-400" : "bg-gray-50 border-gray-300"}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Suelta los archivos aquí...</p>
                ) : (
                    <p>Arrastra y suelta imágenes, o haz clic para seleccionar</p>
                )}
            </div>

            {/* Previsualización */}
            <div className="mt-4 grid grid-cols-3 gap-4">
                {files.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-2">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs mt-2 truncate">{file.name}</p>

                        {/* Botón para eliminar */}
                        <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
