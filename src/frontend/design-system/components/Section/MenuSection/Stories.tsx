/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TestProviders } from "__tests__/_/Provider";
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
  <TestProviders>
    <MenuSection {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {
  currentMenuItem: "item-1",
};
