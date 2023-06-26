import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import { Icon, Loader } from "react-feather";
import { Stack, Typo } from "../../primitives";
import { StyledSoftButton } from "../Button/Button";
import { USE_ROOT_COLOR } from "../../theme";
import { BREAKPOINTS } from "../../constants";
import { Spin } from "../_/Spin";
import { SHADOW_CSS } from "../Card";

const togglePreviousState = (prev: boolean) => !prev;

export interface IDropDownMenuItem {
  id: string;
  label: string;
  description?: string;
  IconComponent?: Icon;
  onClick: () => void;
  order?: number;
}

export interface IProps {
  menuItems: IDropDownMenuItem[];
  isMakingActionRequest?: boolean;
  disabled?: boolean;
}

const Label = styled.span`
  @media (max-width: ${BREAKPOINTS.sm}) {
    display: none;
  }
`;

const StyledDropDownItem = styled.button`
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

const StyledDropDownMenu = styled(Dropdown.Menu)`
  ${SHADOW_CSS}
  margin: 0;

  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
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

const StyledSROnly = styled.span`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

const StyledDropDownToggle = styled(StyledSoftButton)`
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

const StyledCurrentButton = styled(StyledSoftButton)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

export function DropDownMenu({
  menuItems: menuItems$1,
  isMakingActionRequest,
  disabled,
}: IProps) {
  const [isDropDownOpen, setDropDownOpen] = useState(false);

  const toggleDropDown = () => {
    if (!isMakingActionRequest && !disabled) {
      setDropDownOpen(togglePreviousState);
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

  useEffect(() => {
    setCurrentMenuItem(menuItems[0]);
  }, [JSON.stringify(menuItems)]);

  if (menuItems.length === 0) {
    return null;
  }

  const onMenuItemClick = (menuIndex: number) => {
    const menuItem = menuItems[menuIndex];
    toggleDropDown();
    menuItem.onClick();
    setCurrentMenuItem(menuItem);
  };

  const { IconComponent, onClick, label } = currentMenuItem;

  const currentItem = (
    <Stack spacing={4} align="center">
      {/* eslint-disable-next-line no-nested-ternary */}
      {isMakingActionRequest ? (
        <Spin as={Loader} size={14} />
      ) : IconComponent ? (
        <IconComponent size="14" />
      ) : null}
      <Label>{label}</Label>
    </Stack>
  );

  if (menuItems.length === 1) {
    return (
      <StyledSoftButton
        size="sm"
        disabled={isMakingActionRequest || disabled}
        onClick={() => onClick()}
      >
        {currentItem}
      </StyledSoftButton>
    );
  }

  return (
    <Dropdown
      as={Stack}
      spacing={0}
      width="auto"
      show={isDropDownOpen}
      align="end"
      onToggle={toggleDropDown}
    >
      <StyledCurrentButton
        size="sm"
        disabled={isMakingActionRequest || disabled}
        onClick={() => onClick()}
      >
        {currentItem}
      </StyledCurrentButton>
      <StyledDropDownToggle split as={Dropdown.Toggle} size="sm">
        <StyledSROnly>Toggle Dropdown</StyledSROnly>
      </StyledDropDownToggle>
      <StyledDropDownMenu>
        {menuItems.map(({ label: label$1, description }, index) => (
          <StyledDropDownItem
            key={label$1}
            onClick={() => onMenuItemClick(index)}
          >
            <Typo.XS as="span">{label$1}</Typo.XS>
            <br />
            {description ? (
              <Typo.XS color="muted" as="span">
                {description}
              </Typo.XS>
            ) : null}
          </StyledDropDownItem>
        ))}
      </StyledDropDownMenu>
    </Dropdown>
  );
}
