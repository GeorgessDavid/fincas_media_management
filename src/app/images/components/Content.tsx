'use client';
import { useImages } from '@/hooks';
import { Image } from 'components';

export const Content = () => {
  const { images, loading } = useImages();

  console.log(images);
  return (
    <div className="flex gap-4 flex-wrap m-4 gallery">
      {!loading &&
        images?.map((image) => (
          <div key={image?.id} className="flex-shrink-0">
            <Image srcSet={image?.link} alt={image?.title} />
          </div>
        ))
      }
    </div>
  );
}