import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

const Card = ({ className, children, ...props }) => (
    <div
        className={twMerge(clsx("rounded-xl border border-border bg-surface text-primary shadow-sm", className))}
        {...props}
    >
        {children}
    </div>
)

const CardHeader = ({ className, children, ...props }) => (
    <div className={twMerge(clsx("flex flex-col space-y-1.5 p-6", className))} {...props}>
        {children}
    </div>
)

const CardTitle = ({ className, children, ...props }) => (
    <h3 className={twMerge(clsx("font-mono font-semibold leading-none tracking-tight", className))} {...props}>
        {children}
    </h3>
)

const CardDescription = ({ className, children, ...props }) => (
    <p className={twMerge(clsx("text-sm text-secondary font-sans", className))} {...props}>
        {children}
    </p>
)

const CardContent = ({ className, children, ...props }) => (
    <div className={twMerge(clsx("p-6 pt-0", className))} {...props}>
        {children}
    </div>
)

const CardFooter = ({ className, children, ...props }) => (
    <div className={twMerge(clsx("flex items-center p-6 pt-0", className))} {...props}>
        {children}
    </div>
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
