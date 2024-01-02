/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { noop } from "shared/lib/noop";
import { EmptyWrapper } from ".";
import { IEmptyWrapperProps } from "./types";

export default {
  title: "Components/EmptyWrapper",
  component: EmptyWrapper,
  args: {
    text: "Some empty message for you",
  },
};

const Template: Story<IEmptyWrapperProps> = (args) => (
  <ApplicationRoot>
    <EmptyWrapper {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const WithCreateNew = Template.bind({});
WithCreateNew.args = {
  createNew: {
    label: "Add New Item",
    action: () => noop(),
  },
};
