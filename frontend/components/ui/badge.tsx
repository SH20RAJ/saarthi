import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-[#2f3336] bg-[#16181c] text-white",
        secondary: "border-[#2f3336] bg-black text-[#71767b]",
        teal: "border-[#1d9bf0]/40 bg-[#1d9bf0]/10 text-[#1d9bf0]",
        amber: "border-amber-500/40 bg-amber-500/10 text-amber-400",
        success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
        destructive: "border-red-500/40 bg-red-500/10 text-red-400",
        outline: "border-[#2f3336] text-[#71767b] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
