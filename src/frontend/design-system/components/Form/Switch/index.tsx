import { useEffect } from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";

type Sizes = "sm" | "md";

export interface IProps {
  value: boolean;
  onChange: (value: boolean) => void;
  size?: Sizes;
  label?: MessageDescriptor;
  name: string;
  disabled?: boolean;
}

interface ISizeConfig {
  width: number;
  height: number;
  shift: number;
  top: number;
  circleSize: number;
  checkedShift: number;
  marginBottom: number;
  fontSize: "4" | "5";
  labelSpacing: number;
}

const SIZES_CONFIG: Record<Sizes, ISizeConfig> = {
  md: {
    width: 44,
    height: 24,
    shift: 3,
    top: 0,
    checkedShift: 20,
    labelSpacing: 56,
    circleSize: 19,
    fontSize: "4",
    marginBottom: 24,
  },
  sm: {
    width: 26,
    height: 16,
    shift: 2,
    top: 2,
    labelSpacing: 32,
    checkedShift: 10,
    circleSize: 12,
    marginBottom: 12,
    fontSize: "5",
  },
};

const Root = styled.label<{ size: Sizes }>`
  position: relative;
  display: block;
  margin-bottom: ${(props) => SIZES_CONFIG[props.size].marginBottom}px;
`;

const Slider = styled.span<{ size: Sizes }>`
  position: absolute;
  cursor: pointer;
  top: ${(props) => SIZES_CONFIG[props.size].top}px;
  left: 0;
  right: 0;
  bottom: 0;
  width: ${(props) => SIZES_CONFIG[props.size].width}px;
  height: ${(props) => SIZES_CONFIG[props.size].height}px;
  background-color: ${USE_ROOT_COLOR("soft-color")};
  border-radius: ${(props) => SIZES_CONFIG[props.size].height}px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    border-radius: 50%;
    background-color: white;
    height: ${(props) => SIZES_CONFIG[props.size].circleSize}px;
    width: ${(props) => SIZES_CONFIG[props.size].circleSize}px;
    left: ${(props) => SIZES_CONFIG[props.size].shift}px;
    bottom: ${(props) => SIZES_CONFIG[props.size].shift}px;
    transition: 0.4s;
  }
`;

const Input = styled.input<{ $inputSize: Sizes }>`
  appearance: none;

  &:checked + ${Slider} {
    background-color: ${USE_ROOT_COLOR("primary-color")};

    &:before {
      transform: translateX(
        ${(p) => SIZES_CONFIG[p.$inputSize].checkedShift}px
      );
    }
  }

  &:focus + ${Slider} {
    box-shadow: 0 0 1px ${USE_ROOT_COLOR("primary-color")};
  }
`;

export function FormSwitch(props: IProps) {
  const {
    value,
    onChange,
    name,
    disabled,
    label,
    size = "md",
    ...rest
  } = props;
  const ariaProps = Object.fromEntries(
    typescriptSafeObjectDotEntries(rest as Record<string, string>).filter(
      ([key]) => String(key).startsWith("aria-")
    )
  );

  const { _ } = useLingui();

  useEffect(() => {
    if (value === undefined) {
      onChange(false);
    }
  }, [value, onChange]);

  return (
    <Root htmlFor={name} size={size}>
      <Stack $spacing={SIZES_CONFIG[size].labelSpacing} $align="center">
        <Input
          id={name}
          type="checkbox"
          checked={value}
          disabled={disabled}
          $inputSize={size}
          onChange={() => {
            onChange(!value);
          }}
          {...ariaProps}
        />
        <Slider size={size} />
        {label ? (
          <div style={{ cursor: "pointer" }}>
            <Typo.Raw
              $color={disabled ? "muted" : undefined}
              size={SIZES_CONFIG[size].fontSize}
            >
              {_(label)}
            </Typo.Raw>
          </div>
        ) : (
          // Some weird flex issues here so this is needed
          <div />
        )}
      </Stack>
    </Root>
  );
}
