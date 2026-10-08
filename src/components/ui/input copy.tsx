import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }

const inputVariants = cva(
  "flex w-full items-center bg-transparent transition-colors [&_svg:not([class*='text-'])]:text-muted-foreground focus-within:border-primary has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-muted has-[:disabled]:opacity-50 has-[:disabled]:pointer-events-none has-[input[aria-invalid=true]]:border-destructive",
  {
    variants: {
      variant: {
        square: "border border-input",
        rounded: "border border-input",
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
      // Square
      {
        variant: "square",
        size: "xl",
        className: "rounded-[6px] px-4",
      },
      {
        variant: "square",
        size: "lg",
        className: "rounded-[6px] px-4",
      },
      {
        variant: "square",
        size: "md",
        className: "rounded-[6px] px-4",
      },
      {
        variant: "square",
        size: "sm",
        className: "rounded-[4px] px-3",
      },

      // Rounded
      {
        variant: "rounded",
        size: "xl",
        className: "rounded-full px-5",
      },
      {
        variant: "rounded",
        size: "lg",
        className: "rounded-full px-5",
      },
      {
        variant: "rounded",
        size: "md",
        className: "rounded-full px-5",
      },
      {
        variant: "rounded",
        size: "sm",
        className: "rounded-full px-4",
      },

      // Underline
      {
        variant: "underline",
        size: "lg",
        className: "px-0",
      },
      {
        variant: "underline",
        size: "md",
        className: "px-0",
      },
      {
        variant: "underline",
        size: "sm",
        className: "px-0",
      },
    ],

    defaultVariants: {
      variant: "square",
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
  variant = "square",
  size = "md",
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  return (
    <div className={cn(inputVariants({ variant, size }), className)}>
      {startIcon}

      <input
        data-slot="input"
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed"
        {...props}
      />

      {endIcon}
    </div>
  );
}

export { Input };
//disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50
