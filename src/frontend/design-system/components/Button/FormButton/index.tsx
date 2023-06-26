import React from "react";
import { Icon, Loader } from "react-feather";
import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import {
  StyledOutlineButton,
  IStyledBaseButton,
  StyledBaseButton,
} from "../Button";
import { Spin } from "../../_/Spin";
import { ICON_MAP, ButtonIconTypes } from "../constants";
import { useThemeColorShade } from "../../../theme/useTheme";
import { USE_ROOT_COLOR } from "../../../theme/root";

interface IFormButton extends IStyledBaseButton {
  text: (isMakingRequest: boolean) => string;
  icon: ButtonIconTypes | "no-icon";
  isMakingRequest: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  isInverse?: boolean;
}

export const actionButtonIsMakingRequest = (
  isMakingRequest: boolean,
  text: (isMakingRequest: boolean) => string,
  IconCmp: Icon | null
) => {
  const iconProps = {
    size: 14,
    style: {
      marginRight: "4px",
    },
  };
  return isMakingRequest ? (
    <>
      <Spin as={Loader} {...iconProps} />
      <span>{text(true)}</span>
    </>
  ) : (
    <>
      {IconCmp ? <IconCmp {...iconProps} /> : null}
      <span>{text(false)}</span>
    </>
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
  icon,
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

  const IconCmp = icon === "no-icon" ? null : ICON_MAP[icon];

  const toRender = actionButtonIsMakingRequest(isMakingRequest, text, IconCmp);

  return (
    <Stack justify="end">
      {isInverse ? (
        <StyledOutlineButton {...options}>{toRender}</StyledOutlineButton>
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
