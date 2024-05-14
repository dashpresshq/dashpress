import { useEffect } from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";

export interface IProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: MessageDescriptor;
  name: string;
  disabled?: boolean;
}

const SIZES_CONFIG = {
  width: 26,
  height: 16,
  shift: 2,
  top: 0,
  labelSpacing: 32,
  checkedShift: 10,
  circleSize: 12,
  marginBottom: 12,
  fontSize: "5" as const,
};

const Root = styled.label`
  position: relative;
  display: block;
  margin-bottom: ${SIZES_CONFIG.marginBottom}px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: ${SIZES_CONFIG.width}px;
  height: ${SIZES_CONFIG.height}px;
  background-color: ${USE_ROOT_COLOR("soft-color")};
  border-radius: ${SIZES_CONFIG.height}px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    border-radius: 50%;
    background-color: white;
    height: ${SIZES_CONFIG.circleSize}px;
    width: ${SIZES_CONFIG.circleSize}px;
    left: ${SIZES_CONFIG.shift}px;
    bottom: ${SIZES_CONFIG.shift}px;
    transition: 0.4s;
  }
`;

const Input = styled.input`
  appearance: none;

  &:checked + ${Slider} {
    background-color: ${USE_ROOT_COLOR("primary-color")};

    &:before {
      transform: translateX(${SIZES_CONFIG.checkedShift}px);
    }
  }

  &:focus + ${Slider} {
    box-shadow: 0 0 1px ${USE_ROOT_COLOR("primary-color")};
  }
`;

export function FormSwitch(props: IProps) {
  const { value, onChange, name, disabled, label, ...rest } = props;
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
    <Root htmlFor={name}>
      <Stack $spacing={SIZES_CONFIG.labelSpacing} $align="center">
        <Input
          id={name}
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={() => {
            onChange(!value);
          }}
          {...ariaProps}
        />
        <Slider />
        {label ? (
          <div style={{ cursor: "pointer" }}>
            <Typo.Raw
              $color={disabled ? "muted" : undefined}
              size={SIZES_CONFIG.fontSize}
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
