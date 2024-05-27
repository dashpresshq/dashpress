import styled from "styled-components";

import {
  CheckSquare,
  Icon as IconType,
  MinusSquare,
  Square,
} from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

const IconWrapper = styled.span<{ $disabled?: boolean }>`
  align-self: center;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  color: ${(props) =>
    props.$disabled
      ? USE_ROOT_COLOR("muted-text")
      : USE_ROOT_COLOR("primary-color")};
`;

const Icon = styled.i`
  height: 18px;
`;

type CheckboxState = "checked" | "unchecked" | "partial";

export interface IProps {
  onClick: (previousState: CheckboxState) => void;
  state: CheckboxState;
  disabled?: boolean;
  label?: string;
}

const IconPerState: Record<
  IProps["state"],
  { IconCmp: IconType; label: boolean | "mixed" }
> = {
  checked: { IconCmp: CheckSquare, label: true },
  partial: { IconCmp: MinusSquare, label: "mixed" },
  unchecked: { IconCmp: Square, label: false },
};

export function IntermediateCheckBox({
  onClick,
  state,
  disabled,
  label,
}: IProps) {
  return (
    <IconWrapper
      role="checkbox"
      aria-checked={IconPerState[state].label}
      aria-label={label}
      tabIndex={0}
      $disabled={disabled}
      onMouseDown={(e) => {
        e.stopPropagation();

        onClick(state);
      }}
    >
      <Icon as={IconPerState[state].IconCmp} aria-hidden />
    </IconWrapper>
  );
}
