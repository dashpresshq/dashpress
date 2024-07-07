import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";
import { Check, ChevronDown, ChevronUp, Loader } from "react-feather";

import { cn } from "@/components/utils";
import type { ISelectData } from "@/shared/types/options";

import { EmptyWrapper } from "../app/empty-wrapper";
import { FormSearch } from "../app/form/input/search";
import { ListSkeleton } from "../app/skeleton/list";

const SelectRoot = SelectPrimitive.Root;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    isLoading?: boolean;
  }
>(({ className, children, isLoading, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-border bg-transparent px-3 py-2 text-sm font-normal shadow-sm ring-offset-base focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-soft data-[placeholder]:text-muted [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      {isLoading ? (
        <Loader className="size-4 animate-spin opacity-50" />
      ) : (
        <ChevronDown className="size-4 opacity-50" />
      )}
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-base text-main shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    selected: boolean;
  }
>(({ className, selected, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-muted",
      { "bg-hover": selected },
      className
    )}
    {...props}
  >
    {selected && (
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <Check className="size-4" />
      </span>
    )}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export interface ISelectProps {
  options: ISelectData[];
  onChange: (value: string) => void;
  value: string;
  className?: string;
  name: string;
  placeholder: MessageDescriptor;
  disabled?: boolean;
  disabledOptions?: Array<string>;
  isLoading?: boolean;
  onSearch?: {
    onChange: (value: string) => void;
    value: string;
    isLoading: boolean;
    valueLabel?: string;
  };
}

const LOCAL_SEARCH_THRESHOLD = 10;

export function Select({
  onChange,
  options: fullOptions,
  disabled,
  isLoading,
  value,
  name,
  placeholder,
  className,
  onSearch: onSearchForAsync,
  disabledOptions,
}: ISelectProps) {
  const { _ } = useLingui();

  const valueLabel = fullOptions.find(
    (option) => String(option.value) === String(value)
  )?.label;

  const [searchString, setSearchString] = React.useState("");

  const onSearch = React.useMemo<ISelectProps["onSearch"]>(() => {
    if (onSearchForAsync) {
      return onSearchForAsync;
    }
    if (fullOptions.length <= LOCAL_SEARCH_THRESHOLD) {
      return undefined;
    }

    return {
      isLoading: false,
      value: searchString,
      onChange: setSearchString,
    };
  }, [fullOptions, searchString]);

  const optionsToRender = React.useMemo<ISelectData[]>(() => {
    if (!onSearch) {
      return fullOptions;
    }

    if (!searchString) {
      return fullOptions;
    }

    const searchStringInLower = searchString.toLowerCase();

    return fullOptions.filter(({ label }) =>
      _(label).toLocaleLowerCase().includes(searchStringInLower)
    );
  }, [fullOptions, searchString]);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <SelectRoot
      onValueChange={(value$1) => {
        if (value$1) {
          onChange(value$1);
        }
      }}
      value={value}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        className={className}
        name={name}
        id={name}
        disabled={disabled}
        isLoading={isLoading}
      >
        <SelectValue placeholder={_(placeholder)}>
          {onSearch?.valueLabel || (valueLabel ? _(valueLabel) : null)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {onSearch && (
          <div className="mb-1">
            <FormSearch
              initialValue={onSearch.value}
              onChange={onSearch.onChange}
              loading={onSearch.isLoading}
              shouldAutoFocus={isOpen}
            />
          </div>
        )}
        {onSearch?.value &&
          optionsToRender.length === 0 &&
          !onSearch?.isLoading && (
            <EmptyWrapper text={msg`No Search Results`} />
          )}
        {fullOptions.length === 0 && !onSearch && (
          <EmptyWrapper text={msg`No Options`} />
        )}
        {onSearch?.isLoading && <ListSkeleton count={10} />}
        {optionsToRender.map(({ value: value$1, label }) => (
          <SelectItem
            key={String(value$1)}
            value={String(value$1)}
            selected={String(value$1) === String(value)}
            disabled={disabledOptions?.includes(`${value$1}`)}
          >
            {_(label)}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
