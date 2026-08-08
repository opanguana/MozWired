import Image from 'next/image';

import { getBrandAsset } from '@/config/brand-assets';
import { cn } from '@/lib/utils';

export function BrandMark({ brand, inverse = false }: { brand: string; inverse?: boolean }) {
  const asset = getBrandAsset(brand);

  return (
    <span
      role="img"
      aria-label={`${brand} brand`}
      className="flex h-5 w-[4.5rem] shrink-0 items-center justify-end"
    >
      {asset ? (
        <Image
          src={asset.src}
          alt=""
          width={asset.width}
          height={asset.height}
          className={cn(
            'max-h-5 max-w-full object-contain object-right',
            inverse && 'brightness-0 invert'
          )}
        />
      ) : (
        <span
          className={cn(
            'max-w-full truncate text-[9px] font-bold uppercase tracking-[0.08em]',
            inverse ? 'text-white/70' : 'text-store-teal'
          )}
        >
          {brand}
        </span>
      )}
    </span>
  );
}
