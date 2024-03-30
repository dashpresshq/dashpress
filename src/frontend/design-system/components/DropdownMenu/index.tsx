import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { Loader, MoreVertical } from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Z_INDEXES } from "frontend/design-system/constants/zIndex";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { useRouter } from "next/router";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { SoftButtonStyled } from "../Button/Button";
import { BREAKPOINTS } from "../../constants";
import { Spin } from "../_/Spin";
import { SHADOW_CSS } from "../Card";
import { IGroupActionButton } from "../Button/types";
import { ConfirmAlert } from "../ConfirmAlert";

export interface IDropDownMenuItem extends IGroupActionButton {
  description?: string;
}

export interface IProps {
  menuItems: IDropDownMenuItem[];
  ariaLabel: string;
  disabled?: boolean;
  ellipsis?: true;
}

const Label = styled.span`
  text-wrap: nowrap;
  @media (max-width: ${BREAKPOINTS.sm}) {
    display: none;
  }
`;

const DropDownItem = styled.button`
  display: block;
  width: 100%;
  padding: 6px 12px;
  clear: both;
  font-weight: 400;
  cursor: pointer;
  font-size: 16px;
  line-height: 20px;
  color: ${USE_ROOT_COLOR("main-text")};
  text-align: inherit;
  background: ${USE_ROOT_COLOR("base-color")};
  border: 0;
  &:hover {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    color: ${USE_ROOT_COLOR("main-text")};
  }
`;

const DropDownMenuStyled = styled(Dropdown.Menu)`
  ${SHADOW_CSS}
  margin: 0;

  position: absolute;
  top: 100%;
  left: 0;
  z-index: ${Z_INDEXES.dropDown};
  display: none;
  float: left;
  min-width: 10rem;
  margin: 0.125rem 0 0;
  font-size: 0.8125rem;
  color: ${USE_ROOT_COLOR("main-text")};
  text-align: left;
  list-style: none;
  background-color: ${USE_ROOT_COLOR("base-color")};
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;

  right: 0;
  left: auto;

  &.show {
    display: block;
  }
`;

const SROnly = styled.span`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

const EllipsisDropDownToggle = styled(SoftButtonStyled)`
  padding: 2px 4px;
`;

const DropDownToggle = styled(SoftButtonStyled)`
  display: inline-block;
  margin-left: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  white-space: nowrap;
  position: relative;
  flex: 1 1 auto;

  &::after {
    display: inline-block;
    vertical-align: middle;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

const CurrentButton = styled(SoftButtonStyled)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;
export function DropDownMenu({
  menuItems: menuItems$1,
  disabled,
  ellipsis,
  ariaLabel,
}: IProps) {
  const dropDownMode = useToggle();
  const router = useRouter();

  const toggleDropDown = () => {
    if (!disabled) {
      dropDownMode.toggle();
    }
  };

  const menuItems = useMemo(() => {
    return [...menuItems$1].sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    });
  }, [menuItems$1]);

  const [currentMenuItem, setCurrentMenuItem] = useState<IDropDownMenuItem>(
    menuItems[0]
  );

  const runAction = (actionMenuItem: IDropDownMenuItem) => {
    if (typeof actionMenuItem.action === "string") {
      router.push(actionMenuItem.action);
      return;
    }

    if (actionMenuItem.shouldConfirmAlert) {
      return ConfirmAlert({
        title: actionMenuItem.shouldConfirmAlert,
        action: actionMenuItem.action,
      });
    }

    actionMenuItem.action();
  };

  useEffect(() => {
    setCurrentMenuItem(menuItems[0]);
  }, [JSON.stringify(menuItems)]);

  if (menuItems.length === 0) {
    return null;
  }

  const onMenuItemClick = (menuIndex: number) => {
    const menuItem = menuItems[menuIndex];
    toggleDropDown();
    runAction(menuItem);
    setCurrentMenuItem(menuItem);
  };

  const { systemIcon, label } = currentMenuItem;

  const currentItem = (
    <Stack spacing={4} align="center">
      {currentMenuItem.isMakingRequest ? (
        <Spin as={Loader} size={14} />
      ) : (
        <SystemIcon icon={systemIcon} size={14} />
      )}
      <Label>{label}</Label>
    </Stack>
  );

  if (menuItems.length === 1 && !ellipsis) {
    return (
      <SoftButtonStyled
        size="sm"
        disabled={currentMenuItem.isMakingRequest || disabled}
        onClick={() => runAction(currentMenuItem)}
      >
        {currentItem}
      </SoftButtonStyled>
    );
  }

  return (
    <Dropdown
      as={Stack}
      spacing={0}
      width="auto"
      show={dropDownMode.isOn}
      align="end"
      onToggle={toggleDropDown}
    >
      {ellipsis ? (
        <EllipsisDropDownToggle split as={Dropdown.Toggle} size="sm">
          <MoreVertical
            size={16}
            style={{ cursor: "pointer" }}
            aria-label={ariaLabel}
          />
        </EllipsisDropDownToggle>
      ) : (
        <>
          <CurrentButton
            size="sm"
            disabled={disabled || currentMenuItem.isMakingRequest}
            onClick={() => runAction(currentMenuItem)}
            type="button"
          >
            {currentItem}
          </CurrentButton>
          <DropDownToggle split as={Dropdown.Toggle} size="sm">
            <SROnly>Toggle Dropdown</SROnly>
          </DropDownToggle>
        </>
      )}
      <DropDownMenuStyled>
        {menuItems.map((menuItem, index) => (
          <DropDownItem
            key={menuItem.label}
            onClick={() => onMenuItemClick(index)}
            disabled={menuItem.disabled}
            type="button"
          >
            <Stack>
              {currentMenuItem.isMakingRequest ? (
                <Spin as={Loader} size={14} />
              ) : (
                <SystemIcon
                  icon={menuItem.systemIcon}
                  size={14}
                  color={menuItem.disabled ? "muted-text" : "main-text"}
                />
              )}
              <Typo.XS
                as="span"
                color={menuItem.disabled ? "muted" : undefined}
              >
                {menuItem.label}
              </Typo.XS>
            </Stack>
            {menuItem.description ? (
              <Typo.XS color="muted" as="span">
                {menuItem.description}
              </Typo.XS>
            ) : null}
          </DropDownItem>
        ))}
      </DropDownMenuStyled>
    </Dropdown>
  );
}

// TODO
// isMakingRequest?: boolean;
// color?: keyof typeof SYSTEM_COLORS;
