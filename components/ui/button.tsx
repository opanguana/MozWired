import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Button style variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-xs hover:bg-blue-700",
        destructive: "bg-red-500 text-white shadow-xs hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700",
        outline: "border border-gray-300 bg-transparent text-gray-700 shadow-xs hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
        secondary: "bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        appleOutline: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component supporting multiple variants, sizes, and accessibility props.
 * Can render as a native button or custom element using 'asChild'.
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as custom element (e.g., Link) instead of <button> */
    asChild?: boolean;
    /** Accessible label for screen readers */
    "aria-label"?: string;
    /** Reference to element describing the button */
    "aria-describedby"?: string;
  }) {
  // Use Slot for custom element, otherwise render native button
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      role={asChild ? "button" : undefined}
      tabIndex={0}
      {...props}
    />
  );
}

export { Button, buttonVariants };