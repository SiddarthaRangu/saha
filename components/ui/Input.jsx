import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

const Input = forwardRef(({ className, type, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                type={type}
                className={twMerge(
                    clsx(
                        "flex h-11 w-full rounded-md border border-border bg-white/5 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        error ? "border-red-500 focus-visible:ring-red-500" : "border-border",
                        className
                    )
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    )
})
Input.displayName = "Input"

export { Input }
