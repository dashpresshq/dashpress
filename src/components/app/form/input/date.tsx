import { FieldMetaState } from "react-final-form";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "react-feather";
import { Trans, msg } from "@lingui/macro";
import {
  LabelAndError,
  generateClassNames,
  generateFormArias,
} from "@/components/app/form/input/label-and-error";
import { ISharedFormInput } from "@/components/app/form/input/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SoftButton } from "@/components/app/button/soft";
import { useToggle } from "@/frontend/hooks/state/useToggleState";

interface IFormDateInput extends ISharedFormInput {
  minDate?: Date;
  maxDate?: Date;
}

interface IProps {
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date | null) => void;
  value: Date;
  id?: string;
  disabled?: boolean;
  className?: string;
  meta?: FieldMetaState<any>;
}

export const dateWithoutTimezone = (date: Date) => {
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return new Date(withoutTimezone);
};

export function ControlledFormDateInput({
  minDate,
  maxDate,
  onChange,
  value,
  id,
  disabled,
  className,
  meta,
}: IProps) {
  const isOpen = useToggle();

  const onChangeRemoveTimeZone = (inputValue: Date | null) => {
    onChange(dateWithoutTimezone(inputValue));
  };

  return (
    <Popover onOpenChange={isOpen.set}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "input-base h-9 justify-start text-sm",
            {
              "ring-1 ring-primary": isOpen.isOn,
            },
            generateClassNames(meta),
            className
          )}
          id={id}
          disabled={disabled}
          {...generateFormArias(meta)}
        >
          <CalendarIcon
            className={cn("mr-2 h-4 w-4", {
              "text-muted": !value,
            })}
          />
          {value ? (
            format(new Date(value), "PPP")
          ) : (
            <span className="text-muted">
              <Trans>Pick a date </Trans>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChangeRemoveTimeZone}
          initialFocus
          fromDate={minDate}
          toDate={maxDate}
          footer={
            <SoftButton
              systemIcon="Close"
              action={() => onChange(null)}
              label={msg`Clear`}
              className="w-full mt-3"
              size="sm"
              disabled={!value}
            />
          }
        />
      </PopoverContent>
    </Popover>
  );
}
// TODO fix date with timezone
export function FormDateInput(formInput: IFormDateInput) {
  const { input, disabled, meta, minDate, maxDate } = formInput;
  let { value } = input;
  if (value && typeof value === "string") {
    value = new Date(value);
    input.onChange(value);
  }
  return (
    <LabelAndError formInput={formInput}>
      <ControlledFormDateInput
        onChange={input.onChange}
        value={value}
        id={input.name}
        minDate={minDate}
        maxDate={maxDate}
        meta={meta}
        disabled={disabled}
      />
    </LabelAndError>
  );
}
