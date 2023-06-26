/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { Minus, Plus, Save } from "react-feather";
import { DropDownMenu, IProps } from ".";
import { ApplicationRoot } from "../../ApplicationRoot";

export default {
  title: "Components/DropdownMenu",
  component: DropDownMenu,
  args: {
    menuItems: [
      {
        id: "menu-item-1",
        label: "Menu Item 1",
        IconComponent: Save,
        onClick: () => {},
      },
      {
        id: "menu-item-2",
        label: "Menu Item 2",
        description: "Hello There, Lorem Ipsum, Dolor Amet",
        IconComponent: Plus,
        onClick: () => {},
      },
      {
        id: "menu-item-3",
        label: "Menu Item 3",
        description: "Hello There, Lorem Ipsum, Dolor Amet",
        IconComponent: Minus,
        onClick: () => {},
      },
    ],
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DropDownMenu {...args} />
    </div>
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const MakingRequest = Template.bind({});
MakingRequest.args = {
  isMakingActionRequest: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const SingleAction = Template.bind({});
SingleAction.args = {
  menuItems: [
    {
      id: "menu-item-1",
      label: "Menu Item 1",
      IconComponent: Save,
      onClick: () => {},
    },
  ],
};

export const OrderItems = Template.bind({});
OrderItems.args = {
  menuItems: [
    {
      id: "menu-item-2",
      label: "Menu Item 2",
      IconComponent: Save,
      onClick: () => {},
      order: 2,
    },
    {
      id: "menu-item-1",
      label: "Menu Item 1",
      IconComponent: Save,
      onClick: () => {},
      order: 1,
    },
    {
      id: "menu-item-3",
      label: "Menu Item 3",
      IconComponent: Save,
      onClick: () => {},
      order: 3,
    },
  ],
};
