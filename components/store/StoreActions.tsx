import Link from 'next/link';

import { cn } from '@/lib/utils';

export type StoreAction = {
  label: string;
  href: string;
  accessibleLabel?: string;
};

type StoreActionsProps = {
  showPrimaryAction?: boolean;
  showSecondaryAction?: boolean;
  primaryAction?: StoreAction;
  secondaryAction?: StoreAction;
  className?: string;
};

export function StoreActions({
  showPrimaryAction = true,
  showSecondaryAction = true,
  primaryAction = { label: 'Explore services', href: '#services' },
  secondaryAction = { label: 'Talk to a specialist', href: '#support' },
  className,
}: StoreActionsProps) {
  if (!showPrimaryAction && !showSecondaryAction) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {showPrimaryAction && (
        <Link
          href={primaryAction.href}
          aria-label={primaryAction.accessibleLabel}
          className="focus-ring inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-store-cyan"
        >
          {primaryAction.label}
        </Link>
      )}
      {showSecondaryAction && (
        <Link
          href={secondaryAction.href}
          aria-label={secondaryAction.accessibleLabel}
          className="focus-ring inline-flex min-h-11 items-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
        >
          {secondaryAction.label}
        </Link>
      )}
    </div>
  );
}
