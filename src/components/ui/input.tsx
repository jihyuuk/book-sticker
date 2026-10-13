import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full items-center bg-transparent transition-colors " +
    "[&_svg:not([class*='text-'])]:text-muted-foreground " +
    "focus-within:border-primary " +
    "has-[:disabled]:pointer-events-none " +
    "has-[:disabled]:cursor-not-allowed " +
    "has-[:disabled]:bg-muted " +
    "has-[:disabled]:opacity-50 " +
    "has-[input[aria-invalid=true]]:border-destructive",
  {
    variants: {
      variant: {
        outline: "border border-input",
        filled: "border border-transparent bg-gray-100 focus-within:bg-blue-50",
        underline: "border-b border-input",
      },

      size: {
        xl: "h-13 text-title-4 gap-[6px] [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='stroke-'])]:stroke-[1.5]",
        lg: "h-12 text-body-2 gap-[6px] [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='stroke-'])]:stroke-[1.5]",
        md: "h-11 text-body-2 gap-[6px] [&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='stroke-'])]:stroke-[1.5]",
        sm: "h-9 text-body-3 gap-[4px] [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='stroke-'])]:stroke-[1.5]",
      },
    },

    compoundVariants: [
      // Outline & Filled
      {
        variant: ["outline", "filled"],
        size: ["xl", "lg", "md"],
        className: "rounded-[6px] px-4",
      },
      {
        variant: ["outline", "filled"],
        size: "sm",
        className: "rounded-[4px] px-3",
      },

      // Underline
      {
        variant: "underline",
        className: "px-0",
      },
    ],

    defaultVariants: {
      variant: "filled",
      size: "md",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  };

function Input({
  className,
  variant = "filled",
  size = "lg",
  startIcon,
  endIcon,
  maxLength = 30,
  ...props
}: InputProps) {
  return (
    <div className={cn(inputVariants({ variant, size }), className)}>
      {startIcon}

      <input
        maxLength={maxLength}
        data-slot="input"
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />

      {endIcon}
    </div>
  );
}

export { Input };
