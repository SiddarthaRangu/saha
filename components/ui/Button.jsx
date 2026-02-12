import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"
import { PiSpinner } from "react-icons/pi"

const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 border border-transparent shadow-lg shadow-accent/20",
    secondary: "bg-white/10 text-primary border border-white/10 hover:bg-white/20 shadow-sm",
    accent: "bg-accent text-white hover:bg-accent/90 border border-transparent shadow-sm",
    ghost: "bg-transparent text-secondary hover:text-primary hover:bg-white/10",
    outline: "bg-transparent text-primary border border-border hover:bg-white/5",
    link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
}

const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0 flex items-center justify-center",
}

const Button = forwardRef(({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    disabled,
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled || isLoading}
            className={twMerge(
                clsx(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )
            )}
            {...props}
        >
            {isLoading && <PiSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
})

Button.displayName = "Button"

export { Button }
