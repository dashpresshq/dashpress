import { X } from "react-feather";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IColumnFilterBag } from "@/shared/types/data";

interface IProps {
  values: string[];
  filterValue: IColumnFilterBag<string[]>;
  setFilter: (value: IColumnFilterBag<string[]>) => void;
  options: { value: string; label: string }[];
}

export function MultiFilterValues({
  values,
  filterValue,
  setFilter,
  options,
}: IProps) {
  return (
    <>
      {values.map((value) => {
        const label = options.find(
          (option) => String(option.value) === String(value)
        )?.label;
        return (
          <div key={value} className="mb-1 mr-1 inline-flex">
            <div
              className={cn(
                buttonVariants({ variant: "soft", size: "sm" }),
                "rounded-r-none hover:bg-primary-alpha hover:text-primary-alpha-text"
              )}
            >
              {label || value}
            </div>
            <Button
              className="rounded-l-none px-1"
              size="sm"
              variant="destructive"
              onClick={() => {
                setFilter({
                  ...filterValue,
                  value: values.filter((option) => option !== value),
                });
              }}
            >
              <X size={14} />
            </Button>
          </div>
        );
      })}
    </>
  );
}
