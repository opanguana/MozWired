import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-2xl border border-border py-6 shadow-[0_2px_8px_0_rgba(0,0,0,0.15)] transition-colors duration-300",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

export interface HeroCardProps {
  title: string
  description: string
  links?: { label: string; href: string }[]
  variant?: "dark" | "light"
  className?: string
  children?: React.ReactNode
}

export function HeroCard({
  title,
  description,
  links,
  variant = "light",
  className = "",
  children,
}: HeroCardProps) {
  const baseStyles =
    "flex flex-col items-center justify-center text-center py-20 px-6 h-[580px]"

  const variantStyles =
    variant === "dark"
      ? "bg-black text-white"
      : "bg-[#f5f5f7] text-black"

  return (
    <section className={`w-full ${variantStyles} ${className}`}>
      <div className={baseStyles}>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight">{title}</h2>
        <p className="mt-4 text-lg md:text-xl text-gray-600">{description}</p>

        {children ? (
          <div>{children}</div>
        ) : links && links.length > 0 ? (
          <div className="mt-6 flex space-x-6">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-blue-600 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

