import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { label: 'Mac', image: '/images/store/mac.png' },
  { label: 'iPad', image: '/images/store/ipad.png' },
  { label: 'iPhone', image: '/images/store/iphone.png' },
  { label: 'Apple Watch', image: '/images/store/apple-watch.png' },
  { label: 'Apple Vision Pro', image: '/images/store/apple-vision-pro.png' },
  { label: 'AirPods', image: '/images/store/airpods.png' },
  { label: 'AirTag', image: '/images/store/airtag.png' },
  { label: 'Apple TV 4K', image: '/images/store/apple-tv-4k.png' },
  { label: 'HomePod', image: '/images/store/homepod.png' },
  { label: 'Accessories', image: '/images/store/accessories.png' },
  { label: 'Apple Gift Card', image: '/images/store/apple-gift-card.png' },
];

export function CategoryRail() {
  return (
    <nav aria-label="Product categories" className="category-scroll overflow-x-auto">
      <ul className="mx-auto flex w-max min-w-full max-w-store items-start justify-start gap-2 px-5 py-8 lg:px-8">
        {categories.map(({ label, image }) => (
          <li key={label}>
            <Link
              href="#services"
              className="group flex w-[5.5rem] flex-col items-center gap-2 rounded-lg text-center focus-ring"
            >
              <span className="relative block h-[3.75rem] w-[5.75rem] overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="92px"
                  className="object-contain"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[10px] font-semibold leading-tight">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
