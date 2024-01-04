import React, { useId } from "react";
import {
  ChevronRight as ChevronRightIcon,
  Icon as IconType,
} from "react-feather";
import Link from "next/link";
import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { GrabIcon } from "shared/constants/Icons";
import { SortableKnob } from "react-easy-sort";
import { FormButton } from "../../Button/FormButton";
import { FormSwitch } from "../../Form/FormSwitch";
import { ButtonIconTypes } from "../../Button/constants";

const ChevronRight = styled(ChevronRightIcon)<{ $active?: boolean }>`
  width: 14px;
  color: ${(props) =>
    props.$active
      ? USE_ROOT_COLOR("text-on-primary")
      : USE_ROOT_COLOR("primary-color")};
  margin-left: 0.25rem;
`;

const ListItem = styled.button<{
  active: boolean;
  disabled: boolean;
  size?: "xs";
}>`
  justify-content: space-between;
  align-items: center;
  display: flex;

  position: relative;
  padding: 12px 0.75rem;
  background-color: ${USE_ROOT_COLOR("base-color")};
  border-left: 0;
  border: 1px solid transparent;
  border-right: 0;
  border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};

  width: 100%;
  color: ${USE_ROOT_COLOR("main-text")};
  cursor: pointer;
  text-align: inherit;

  & + & {
    border-top-width: 0;
  }

  & + &.active {
    margin-top: -1px;
    border-top-width: 1px;
  }

  &:first-child {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-top: 0;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${USE_ROOT_COLOR("muted-text")};
      pointer-events: none;
      background-color: ${USE_ROOT_COLOR("base-color")};
    `}

  ${({ size }) =>
    size === "xs" &&
    css`
      padding: 6px 0.75rem;
      font-size: 12px;
    `}

  &:hover,
  &:focus {
    z-index: 1;
    color: ${USE_ROOT_COLOR("main-text")};
    text-decoration: none;
    background-color: ${USE_ROOT_COLOR("soft-color")};
  }

  ${({ active }) =>
    active &&
    css`
      z-index: 2;
      color: ${USE_ROOT_COLOR("text-on-primary")} !important;
      background-color: ${USE_ROOT_COLOR("primary-color")} !important;
      border-color: ${USE_ROOT_COLOR("primary-color")};
    `}

  &:active {
    color: ${USE_ROOT_COLOR("main-text")};
    background-color: ${USE_ROOT_COLOR("soft-color")};
  }
`;

const SubLabel = styled.p<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active
      ? USE_ROOT_COLOR("text-on-primary")
      : USE_ROOT_COLOR("muted-text")};
  padding: 0;
  margin: 0;
  font-size: 10px;
  line-height: 0.6;
`;

const Icon = styled.span<{ $active?: boolean; $subtle?: boolean }>`
  color: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.$active
      ? USE_ROOT_COLOR("text-on-primary")
      : props.$subtle
      ? USE_ROOT_COLOR("muted-text")
      : USE_ROOT_COLOR("main-text")};
`;

const Label = styled.label<{ $active?: boolean; $subtle?: boolean }>`
  cursor: pointer;
  color: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.$active
      ? USE_ROOT_COLOR("text-on-primary")
      : props.$subtle
      ? USE_ROOT_COLOR("muted-text")
      : USE_ROOT_COLOR("main-text")};
`;

export interface IListMangerItemProps {
  label: string;
  action?: string | (() => void);
  secondaryAction?: () => void;
  size?: "xs";
  subLabel?: string;
  IconComponent?: IconType;
  disabled?: boolean;
  sortable?: boolean;
  subtle?: boolean;
  active?: boolean;
  toggle?: {
    selected: boolean;
    onChange: () => void;
  };
  actionButtons?: {
    isInverse: boolean;
    label: string;
    icon?: ButtonIconTypes;
    onClick: () => void;
    isMakingRequest?: boolean;
    disabled?: boolean;
  }[];
}

export function ListManagerItem({
  label,
  IconComponent,
  disabled,
  subLabel,
  active,
  toggle,
  action,
  sortable,
  secondaryAction,
  subtle,
  size,
  actionButtons = [],
}: IListMangerItemProps) {
  const id = useId();
  const content = (
    <Stack>
      <Stack align="center">
        <div style={{ display: sortable && !subtle ? "block" : "none" }}>
          <SortableKnob>
            <GrabIcon />
          </SortableKnob>
        </div>
        {IconComponent ? (
          <Icon
            as={IconComponent}
            $active={active}
            $subtle={subtle}
            size="16"
          />
        ) : null}{" "}
        <div>
          <Label htmlFor={id} $active={active} $subtle={subtle}>
            {label}
          </Label>
          {subLabel ? <SubLabel $active={active}>{subLabel}</SubLabel> : null}
        </div>
      </Stack>
      <Stack justify="end" width="initial">
        <>
          {actionButtons.map(
            ({
              label: buttonLabel,
              isInverse,
              onClick: onClick$1,
              isMakingRequest,
              icon,
              disabled: disabled$1,
            }) => (
              <FormButton
                key={buttonLabel}
                text={() => buttonLabel}
                size="xs"
                disabled={disabled$1}
                icon={icon || "no-icon"}
                isMakingRequest={!!isMakingRequest}
                isInverse={isInverse}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onClick$1();
                }}
              />
            )
          )}
          {!(disabled || typeof action !== "string") ? (
            <div>
              <ChevronRight $active={active} />
            </div>
          ) : null}
          {toggle && (
            <FormSwitch
              name={id}
              size="sm"
              disabled
              onChange={toggle.onChange}
              value={toggle.selected}
            />
          )}
        </>
      </Stack>
    </Stack>
  );

  const buttonProps = {
    active: !!active,
    disabled: !!disabled,
    size,
  };

  if (typeof action === "string") {
    return (
      <Link href={action} passHref>
        <ListItem
          as="a"
          {...buttonProps}
          onClick={() => {
            secondaryAction?.();
          }}
        >
          {content}
        </ListItem>
      </Link>
    );
  }

  return (
    <ListItem
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        action?.();
        secondaryAction?.();
        toggle?.onChange();
      }}
      {...buttonProps}
    >
      {content}
    </ListItem>
  );
}
