import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card component: base container for content with rounded corners and shadow.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-white/90 dark:bg-gray-800 backdrop-blur-xl text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200/60 dark:border-gray-700 py-6 shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
      {...props}
    />
  );
}

/**
 * CardHeader: header section for card, supports grid layout.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

/**
 * CardTitle: title section for card.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold text-gray-800 dark:text-gray-100', className)}
      {...props}
    />
  );
}

/**
 * CardDescription: description section for card.
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-gray-600 dark:text-gray-300 text-sm', className)}
      {...props}
    />
  );
}

/**
 * CardAction: action section for card (e.g., buttons).
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

/**
 * CardContent: main content area for card.
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

/**
 * CardFooter: footer section for card.
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };

export interface HeroCardProps {
  title: string;
  description: string;
  links?: { label: string; href: string }[];
  variant?: 'dark' | 'light';
  className?: string;
  children?: React.ReactNode;
}

/**
 * HeroCard: large hero section for landing pages.
 * - Supports dark/light variants
 * - Displays title, description, and optional links or children
 */
export function HeroCard({
  title,
  description,
  links,
  variant = 'light',
  className = '',
  children,
}: HeroCardProps) {
  const baseStyles =
    'flex flex-col items-center justify-center text-center py-20 px-6 h-[580px] backdrop-blur-xl';
  const variantStyles =
    variant === 'dark'
      ? 'bg-gray-800  dark:bg-gray-800 text-white'
      : 'bg-white/90 dark:bg-gray-800 text-black';
  const titleStyles = variant === 'dark' ? 'text-white' : 'text-black dark:text-white';
  const descriptionStyles = variant === 'dark' ? 'text-white' : 'text-gray-600 dark:text-gray-300';

  return (
    <section className={`w-full ${variantStyles} ${className}`}>
      <div className={baseStyles}>
        <h2 className={cn('text-5xl md:text-7xl font-bold tracking-tight', titleStyles)}>
          {title}
        </h2>
        <p className={cn('mt-4 text-lg md:text-xl', descriptionStyles)}>{description}</p>
        {/* Render children (e.g., actions) or links */}
        {children ? (
          <div>{children}</div>
        ) : links && links.length > 0 ? (
          <div className="mt-6 flex space-x-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
