import { Loader } from "react-feather";
import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SystemIconsKeys } from "shared/constants/Icons";
import { SystemIcon } from "frontend/design-system/Icons/System";
import React from "react";
import { OutlineButton, IStyledBaseButton, StyledBaseButton } from "../Button";
import { Spin } from "../../_/Spin";

interface IFormButton extends IStyledBaseButton {
  text: (isMakingRequest: boolean) => string;
  systemIcon: SystemIconsKeys;
  isMakingRequest: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  isInverse?: boolean;
}

export const actionButtonIsMakingRequest = (
  isMakingRequest: boolean,
  text: (isMakingRequest: boolean) => string,
  systemIcon: SystemIconsKeys
) => {
  const iconProps = {
    size: 16,
  };
  return isMakingRequest ? (
    <Stack $align="center" $justify="center" $width="auto">
      <Spin as={Loader} {...iconProps} />
      <span>{text(true)}</span>
    </Stack>
  ) : (
    <Stack $align="center" $justify="center" $width="auto">
      <SystemIcon
        icon={systemIcon}
        {...iconProps}
        style={{ verticalAlign: "top" }}
      />
      <span>{text(false)}</span>
    </Stack>
  );
};

export const StyledButton = styled(StyledBaseButton)<{ $hoverColor: string }>`
  color: ${USE_ROOT_COLOR("text-on-primary")};
  background-color: ${USE_ROOT_COLOR("primary-color")};
  border-color: ${USE_ROOT_COLOR("primary-color")};

  &:hover {
    background-color: ${(props) => props.$hoverColor};
    outline: 0;
    box-shadow: 0 0 0 4px ${USE_ROOT_COLOR("primary-shade-color")};
  }
`;

export function FormButton({
  text,
  disabled,
  isMakingRequest,
  onClick,
  isInverse,
  size,
  systemIcon,
  ...rest
}: IFormButton) {
  const colorShade = useThemeColorShade();

  const options = {
    ...rest,
    disabled: disabled || isMakingRequest,
    onClick,
    type: "submit" as const,
    cursor: isMakingRequest ? ("progress" as const) : undefined,
    size,
  };

  const toRender = actionButtonIsMakingRequest(
    isMakingRequest,
    text,
    systemIcon
  );

  return (
    <Stack $justify="end">
      {isInverse ? (
        <OutlineButton {...options}>{toRender}</OutlineButton>
      ) : (
        <StyledButton
          {...options}
          $hoverColor={colorShade("primary-color", 20)}
        >
          {toRender}
        </StyledButton>
      )}
    </Stack>
  );
}
