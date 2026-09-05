import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1d9bf0] disabled:pointer-events-none disabled:opacity-40 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-[#d7dbdc]",
        blue: "bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]",
        teal: "bg-white text-black hover:bg-[#d7dbdc]", // Alias to white pill
        amber: "bg-white text-black hover:bg-[#d7dbdc]", // Alias to white pill
        destructive: "bg-[#f4212e] text-white hover:bg-[#dc1e29]",
        outline: "border border-[#2f3336] bg-transparent text-white hover:bg-[#16181c] hover:border-[#536471]",
        secondary: "bg-[#16181c] border border-[#2f3336] text-white hover:bg-[#202327]",
        ghost: "hover:bg-[#16181c] text-[#71767b] hover:text-white",
        link: "text-[#1d9bf0] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-[11px]",
        lg: "h-10 rounded-full px-6 text-sm",
        icon: "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
