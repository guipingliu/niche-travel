import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline" | "secondary" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "bg-black text-white hover:bg-black/80": variant === "default",
                    "text-foreground border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
                    "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
                    "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
                },
                className
            )}
            {...props}
        />
    );
}
