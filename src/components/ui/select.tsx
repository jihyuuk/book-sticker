import * as React from "react";
import { cn } from "cn";
import { Select as SelectPrimitive } from "radix-ui";
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// Trigger Variants
const selectTriggerVariants = cva(
  "group flex h-12 w-full min-w-0 items-center justify-between gap-3 text-body-2 text-left font-normal transition-colors " +
    "outline-none select-none " +
    "data-placeholder:text-muted-foreground " +
    "data-[state=open]:border-primary " +
    "data-[state=open]:font-semibold " +
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
    "aria-invalid:border-destructive " +
    "data-[state=open]:aria-invalid:border-destructive " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 " +
    "[&_svg:not([class*='size-'])]:size-5 " +
    "[&_svg:not([class*='stroke-'])]:stroke-[1.5] " +
    "[&_svg:not([class*='text-'])]:text-muted-foreground",
  {
    variants: {
      variant: {
        outline: "border border-input bg-transparent rounded-[6px] px-4",
        filled:
          "border border-transparent bg-gray-100 data-[state=open]:bg-blue-50 rounded-[6px] px-4",
        underline: "border-b border-input bg-transparent px-0",
      },
    },

    defaultVariants: {
      variant: "filled",
    },
  },
);

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectTriggerVariants>;

function SelectTrigger({
  className,
  variant = "filled",
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        selectTriggerVariants({ variant }),
        "*:data-[slot=select-value]:min-w-0",
        "*:data-[slot=select-value]:flex-1",
        "*:data-[slot=select-value]:truncate",
        "*:data-[slot=select-value]:text-left",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="text-muted-foreground pointer-events-none shrink-0 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  const updateScroll = React.useCallback((el: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el;

    setCanScrollUp(scrollTop > 1);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  }, []);

  const viewportRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;

      requestAnimationFrame(() => {
        if (el.isConnected) updateScroll(el);
      });
    },
    [updateScroll],
  );

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "bg-popover text-popover-foreground",
          "ring-foreground/10 relative z-50",
          "max-h-[60dvh] min-w-36",
          "origin-(--radix-select-content-transform-origin)",
          "overflow-x-hidden overflow-y-auto rounded-sm shadow-md ring-1 duration-100",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          "data-[align-trigger=true]:animate-none",
          position === "popper" &&
            "w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectPrimitive.Viewport
          ref={viewportRef}
          onScroll={(e) => updateScroll(e.currentTarget)}
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height)",
            "data-[position=popper]:w-full",
            "data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && "",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>

        {canScrollUp && (
          <div className="from-popover pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b to-transparent" />
        )}

        {canScrollDown && (
          <div className="to-popover pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-linear-to-b from-transparent" />
        )}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-1.5 py-1 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "text-body-2 flex h-12 w-full cursor-default items-center justify-between gap-1.5 rounded-sm px-4 text-sm outline-hidden select-none",
        "hover:bg-accent hover:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[state=checked]:bg-sky-50 data-[state=checked]:font-semibold",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </span>

      <span className="text-primary shrink-0">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
