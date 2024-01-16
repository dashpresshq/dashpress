/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { MenuSection, IProps } from ".";

export default {
  title: "Components/MenuSection",
  component: MenuSection,
  args: {
    menuItems: [
      {
        name: "Item 1",
        action: "item-1",
      },
      {
        name: "First Item",
        action: "first-item",
        order: 0,
      },
      {
        name: "Last Item",
        action: "last-item",
        order: 99,
      },
      {
        name: "Item Icon",
        action: "item-icon",
        systemIcon: "Save",
      },
      {
        name: "Item Action",
        action: action("Click me"),
      },
      {
        name: "Item Disabled",
        action: "item-disabled",
        disabled: true,
      },
    ],
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <MenuSection {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {
  currentMenuItem: "item-1",
};
