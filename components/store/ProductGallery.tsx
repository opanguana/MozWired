'use client';

import { Smartphone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import type { CatalogImage } from '@/catalog/schema';
import { cn } from '@/lib/utils';

export function ProductGallery({
  images,
  productTitle,
  description,
}: {
  images: CatalogImage[];
  productTitle: string;
  description: string;
}) {
  const [selectedId, setSelectedId] = useState(images[0]?.id);
  const selectedImage = images.find(({ id }) => id === selectedId) ?? images[0];

  return (
    <div className="relative min-h-[clamp(24rem,75svh,30rem)] overflow-hidden rounded-2xl bg-[#f5f5f7]/95 text-store-ink shadow-2xl shadow-black/25 md:min-h-[46rem]">
      <p className="relative z-[1] max-w-md p-6 text-sm font-semibold leading-relaxed text-black/60 md:p-8">
        {description}
      </p>
      {selectedImage ? (
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-contain px-8 pb-20 pt-20 md:px-14 md:pb-24 md:pt-24"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 pt-16 text-center"
          role="img"
          aria-label={`${productTitle} product image coming soon`}
        >
          <Smartphone aria-hidden="true" className="size-32 stroke-[0.9]" />
          <p className="font-semibold">{productTitle}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-black/45">Image coming soon</p>
        </div>
      )}

      {images.length > 1 && (
        <div
          className="absolute inset-x-0 bottom-5 z-[2] flex justify-center gap-2 px-6"
          role="group"
          aria-label={`${productTitle} image gallery`}
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedId(image.id)}
              aria-label={`Show image ${index + 1}: ${image.alt}`}
              aria-pressed={image.id === selectedImage?.id}
              className="focus-ring inline-flex size-11 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-3 rounded-full border border-black/30 transition',
                  image.id === selectedImage?.id ? 'bg-black' : 'bg-white/80 hover:bg-black/25'
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
