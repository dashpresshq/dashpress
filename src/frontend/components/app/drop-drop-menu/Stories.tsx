/* eslint-disable react/function-component-definition */

import type { Story } from "@storybook/react";

import { TestProviders } from "@/tests/Provider";

import type { IProps } from ".";
import { DropDownMenu } from ".";

export default {
  title: "Components/DropdownMenu",
  component: DropDownMenu,
  args: {
    menuItems: [
      {
        id: "menu-item-1",
        label: "Menu Item 1",
        systemIcon: "Save",
        onClick: () => {},
      },
      {
        id: "menu-item-2",
        label: "Menu Item 2",
        description: "Hello There, Lorem Ipsum, Dolor Amet",
        systemIcon: "Plus",
        onClick: () => {},
      },
      {
        id: "menu-item-3",
        label: "Menu Item 3",
        description: "Hello There, Lorem Ipsum, Dolor Amet",
        systemIcon: "Minus",
        onClick: () => {},
      },
    ],
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <div className="flex justify-center">
      <DropDownMenu {...args} />
    </div>
  </TestProviders>
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
      systemIcon: "Save",
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
      systemIcon: "Save",
      onClick: () => {},
      order: 2,
    },
    {
      id: "menu-item-1",
      label: "Menu Item 1",
      systemIcon: "Save",
      onClick: () => {},
      order: 1,
    },
    {
      id: "menu-item-3",
      label: "Menu Item 3",
      systemIcon: "Save",
      onClick: () => {},
      order: 3,
    },
  ],
};
