import React from 'react';
import { Button } from '@/components/ui/button';

// Button variants allowed for CardActions
export type ButtonVariant =
  | 'primary'
  | 'appleOutline'
  | 'link'
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost';

// Single action button definition
export interface CardAction {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

// Props for CardActions component
export interface CardActionsProps {
  actions?: CardAction[];
  className?: string;
}

/**
 * CardActions - Renders a row of action buttons for a card.
 * Flexible, accessible, and extensible.
 */
export function CardActions({
  actions = [
    { label: 'Learn more', variant: 'primary' },
    { label: 'Buy', variant: 'appleOutline' },
  ],
  className = 'flex gap-3 mt-4',
}: CardActionsProps) {
  return (
    <div className={className}>
      {actions.map((action, idx) => (
        <Button
          key={action.label + idx}
          variant={action.variant}
          onClick={action.onClick}
          aria-label={action.ariaLabel || action.label}
          disabled={action.disabled}
          className={cn('transition-all duration-300', action.className)}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      ))}
    </div>
  );
}

// Re-import cn for CardActions
import { cn } from '@/lib/utils';
