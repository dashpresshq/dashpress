import { useLingui } from "@lingui/react";
import type { VariantProps } from "class-variance-authority";

import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils";
import { sluggify } from "@/shared/lib/strings";
import type { ISelectData } from "@/shared/types/options";

import { LabelAndError } from "./label-and-error";
import type { IBaseFormSelect } from "./types";

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
  size?: VariantProps<typeof buttonVariants>["size"];
}

export function FormSelectButton(formInput: IFormSelect) {
  const { input, selectData, disabled, size } = formInput;

  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <div className="inline-flex">
        {selectData.map(({ value, label }, index) => {
          const isChecked =
            input.value === value || (index === 0 && input.value === undefined);

          return (
            <Button
              variant="outline"
              type="button"
              size={size}
              role="option"
              aria-selected={isChecked}
              disabled={disabled}
              key={`${value}`}
              className={cn(
                "rounded-none border-l-0 first:rounded-l-sm first:border-l last:rounded-r-sm",
                {
                  "bg-primary text-primary-text": isChecked,
                }
              )}
              onClick={() => input.onChange(value)}
            >
              <input
                type="radio"
                className="sr-only pointer-events-none"
                name={`${input.name}__${sluggify(
                  // eslint-disable-next-line no-nested-ternary
                  typeof value === "boolean"
                    ? value
                      ? "true"
                      : "false"
                    : value
                )}`}
                readOnly
                checked={isChecked}
              />
              {_(label)}
            </Button>
          );
        })}
      </div>
    </LabelAndError>
  );
}
