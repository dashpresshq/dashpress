/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Plus } from "react-feather";
import { SectionListItem, IProps } from ".";
import { ApplicationRoot } from "../../../ApplicationRoot";

export default {
  title: "Components/SectionListItem",
  component: SectionListItem,
  args: {
    label: "Section List Item",
    action: "/go-there",
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <SectionListItem {...args} />
    <SectionListItem {...args} />
    <SectionListItem {...args} />
    <SectionListItem {...args} />
  </ApplicationRoot>
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
  IconComponent: Plus,
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
