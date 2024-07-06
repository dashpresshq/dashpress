/* eslint-disable react/function-component-definition */

import { TestProviders } from "__tests__/_/Provider";
import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";

import type { IListMangerItemProps } from ".";
import { ListManagerItem } from ".";

export default {
  title: "Components/ListManagerItem",
  component: ListManagerItem,
  args: {
    label: "Section List Item",
    action: "/go-there",
  },
};

const Template: Story<IListMangerItemProps> = (args) => (
  <TestProviders>
    <ListManagerItem {...args} />
    <ListManagerItem {...args} />
    <ListManagerItem {...args} />
    <ListManagerItem {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const SmallSize = Template.bind({});
SmallSize.args = {
  size: "xs",
};

export const EmptyAction = Template.bind({});
EmptyAction.args = {
  action: undefined,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  systemIcon: "Plus",
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Subtle = Template.bind({});
Subtle.args = {
  subtle: true,
};

export const Active = Template.bind({});
Active.args = {
  active: true,
};

export const WithSubLabel = Template.bind({});
WithSubLabel.args = {
  subLabel: "I am beneath you",
};

export const WithActionButtons = Template.bind({});
WithActionButtons.args = {
  actionButtons: [
    {
      isInverse: true,
      label: "Hello",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: true,
      label: "Hala",
      onClick: action("Click Me"),
      isMakingRequest: true,
    },
    {
      isInverse: false,
      label: "Halo",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: false,
      label: "Helo",
      onClick: action("Click Me"),
      isMakingRequest: true,
    },
  ],
};

export const Permission = Template.bind({});
Permission.args = {
  actionButtons: [
    {
      isInverse: false,
      label: "Table",
      icon: "check",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: false,
      label: "Details",
      icon: "check",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: false,
      label: "Create",
      icon: "check",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: true,
      label: "Update",
      icon: "square",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: true,
      label: "Delete",
      icon: "square",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
    {
      isInverse: true,
      label: "Export",
      icon: "square",
      onClick: action("Click Me"),
      isMakingRequest: false,
    },
  ],
};

export const WithToggleSelected = Template.bind({});
WithToggleSelected.args = {
  action: undefined,
  toggle: { selected: true, onChange: action("onChange") },
};

export const WithToggleNotSelected = Template.bind({});
WithToggleNotSelected.args = {
  action: undefined,
  toggle: { selected: false, onChange: action("onChange") },
};
