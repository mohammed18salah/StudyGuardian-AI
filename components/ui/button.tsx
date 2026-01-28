import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
                    variant === "outline" && "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
                    variant === "ghost" && "hover:bg-secondary hover:text-secondary-foreground",
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 rounded-md px-3",
                    size === "lg" && "h-11 rounded-md px-8",
                    size === "icon" && "h-10 w-10",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
