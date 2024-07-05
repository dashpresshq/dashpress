import type { Icon as IconType } from "react-feather";
import { CheckSquare, MinusSquare, Square } from "react-feather";
import { cn } from "@/lib/utils";

type CheckboxState = "checked" | "unchecked" | "partial";

export interface IProps {
  onClick: (previousState: CheckboxState) => void;
  state: CheckboxState;
  disabled?: boolean;
  label?: string;
}

const IconPerState: Record<
  IProps["state"],
  { IconCmp: IconType; ariaChecked: boolean | "mixed" }
> = {
  checked: { IconCmp: CheckSquare, ariaChecked: true },
  partial: { IconCmp: MinusSquare, ariaChecked: "mixed" },
  unchecked: { IconCmp: Square, ariaChecked: false },
};

export function IntermediateCheckBox({
  onClick,
  state,
  disabled,
  label,
}: IProps) {
  const { IconCmp, ariaChecked } = IconPerState[state];
  return (
    <i
      role="checkbox"
      aria-checked={ariaChecked}
      aria-label={label}
      className={cn(
        "size-4 cursor-pointer self-center rounded-sm text-primary",
        {
          "cursor-not-allowed text-muted": disabled,
        }
      )}
      tabIndex={0}
      onMouseDown={(e) => {
        e.stopPropagation();

        onClick(state);
      }}
    >
      <IconCmp className="size-5" aria-hidden />
    </i>
  );
}
