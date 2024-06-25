import { useId } from "react";
import { ChevronRight as ChevronRightIcon } from "react-feather";
import Link from "next/link";
import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SortableKnob } from "react-easy-sort";
import { SystemIconsKeys } from "shared/constants/Icons";
import { MessageDescriptor } from "@lingui/core";
import { cn } from "@/lib/utils";
import { GrabIcon, SystemIcon } from "../../system-icons";
import { FormButton } from "../../button/form";
import { FormSwitch } from "../../form/input/switch";

const ChevronRight = styled(ChevronRightIcon)<{ $active?: boolean }>`
  width: 14px;
  color: ${(props) =>
    props.$active
      ? USE_ROOT_COLOR("text-on-primary")
      : USE_ROOT_COLOR("primary-color")};
  margin-left: 0.25rem;
`;

const ListItem = styled.button<{
  $active: boolean;
  $disabled: boolean;
  $size?: "xs";
}>`
  justify-content: space-between;
  align-items: center;
  display: flex;

  position: relative;
  padding: 0.575rem;
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

  ${({ $disabled }) =>
    $disabled &&
    css`
      color: ${USE_ROOT_COLOR("muted-text")};
      pointer-events: none;
      background-color: ${USE_ROOT_COLOR("base-color")};
    `}

  ${({ $size }) =>
    $size === "xs" &&
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

  ${({ $active }) =>
    $active &&
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

const Label = styled.label<{ $active?: boolean; $subtle?: boolean }>`
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
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
  systemIcon?: SystemIconsKeys;
  disabled?: boolean;
  sortable?: boolean;
  subtle?: boolean;
  active?: boolean;
  toggle?: {
    selected: boolean;
    onChange: () => void;
  };
  actionButtons?: {
    id: string;
    isInverse: boolean;
    label: MessageDescriptor;
    systemIcon: SystemIconsKeys;
    onClick: () => void;
    isMakingRequest?: boolean;
    disabled?: boolean;
  }[];
}

export function ListManagerItem({
  label,
  systemIcon,
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
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-3">
        <div
          className={cn("hidden", {
            block: sortable && !subtle,
          })}
        >
          <SortableKnob>
            <GrabIcon />
          </SortableKnob>
        </div>
        {systemIcon ? (
          <SystemIcon
            className={cn("w-4 h-4  text-main", {
              "text-muted": subtle,
              "text-primary-text": active,
            })}
            icon={systemIcon}
          />
        ) : null}{" "}
        <div>
          <Label htmlFor={id} $active={active} $subtle={subtle}>
            <p
              className={cn("text-sm text-main", {
                "text-muted": subtle,
                "text-primary-text": active,
              })}
            >
              {label}
            </p>
          </Label>
          {subLabel ? <SubLabel $active={active}>{subLabel}</SubLabel> : null}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        {actionButtons.map(
          ({
            label: buttonLabel,
            isInverse,
            onClick: onClick$1,
            isMakingRequest,
            disabled: disabled$1,
            systemIcon: systemIcon$1,
          }) => (
            <FormButton
              key={buttonLabel.id}
              text={() => buttonLabel}
              size="sm"
              systemIcon={systemIcon$1}
              disabled={disabled$1}
              isMakingRequest={!!isMakingRequest}
              variant={isInverse ? "outline" : undefined}
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
            onChange={toggle.onChange}
            value={toggle.selected}
          />
        )}
      </div>
    </div>
  );

  const buttonProps = {
    $active: !!active,
    $disabled: !!disabled,
    $size: size,
  };

  if (typeof action === "string") {
    return (
      <ListItem
        as={Link}
        href={action}
        {...buttonProps}
        onClick={() => {
          secondaryAction?.();
        }}
      >
        {content}
      </ListItem>
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
