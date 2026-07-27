import Image from 'next/image';
import Link from 'next/link';

const footerGroups = [
  {
    title: 'Shop',
    links: ['Mac', 'iPad', 'iPhone', 'Apple Watch', 'Audio', 'Accessories'],
  },
  {
    title: 'Account',
    links: ['Manage Your Account', 'Saved Items', 'Order History'],
  },
  {
    title: 'MozWired Store',
    links: ['Find a Store', 'Today at MozWired', 'Financing', 'Order Status'],
  },
  {
    title: 'For Business',
    links: [
      'MozWired and Business',
      'Shop for Business',
      'MozWired and Education',
      'Shop for College',
    ],
  },
  {
    title: 'About MozWired',
    links: ['Newsroom', 'Leadership', 'Careers', 'Investors', 'Events', 'Contact MozWired'],
  },
];

const footerLinkClass =
  'rounded-sm text-white/45 transition-colors duration-200 hover:text-white focus-ring';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090a] text-white" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-[8rem_repeat(5,minmax(0,1fr))]">
          <Link
            href="/"
            aria-label="MozWired home"
            className="col-span-2 h-fit w-fit rounded-sm focus-ring md:col-span-1"
          >
            <Image
              src="/images/brand/mw-white.png"
              alt=""
              width={221}
              height={141}
              className="h-7 w-auto opacity-90"
            />
          </Link>

          {footerGroups.map(({ title, links }) => (
            <section
              key={title}
              aria-labelledby={`footer-${title.toLowerCase().replaceAll(' ', '-')}`}
            >
              <h2
                id={`footer-${title.toLowerCase().replaceAll(' ', '-')}`}
                className="text-xs font-semibold text-white/90"
              >
                {title}
              </h2>
              <ul className="mt-5 grid gap-3 text-xs">
                {links.map((label) => (
                  <li key={label}>
                    <Link href="#" className={footerLinkClass}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white/90">Stay Updated</h2>
            <p className="mt-2 text-xs text-white/40">Product news and offers from MozWired.</p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-store-cyan focus:outline-none"
            />
            <button
              type="button"
              className="focus-ring rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-store-cyan"
            >
              Join
            </button>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-[11px] text-white/35 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} MozWired Inc. All rights reserved.</p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {['Privacy Policy', 'Terms of Use', 'Legal', 'Site Map'].map((label) => (
                <li key={label}>
                  <Link href="#" className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="flex items-center gap-2">
            <svg aria-hidden="true" className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Mozambique
          </p>
        </div>
      </div>
    </footer>
  );
}
