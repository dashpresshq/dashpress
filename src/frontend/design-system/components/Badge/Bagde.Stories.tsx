/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { Badge, IProps } from "./Badge";
import { ApplicationRoot } from "../../ApplicationRoot";

export default {
  title: "Components/Badge",
  component: Badge,
  args: {
    text: "1.8%",
    color: "success",
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <Badge {...args} />
  </ApplicationRoot>
);

export const Success = Template.bind({});
Success.args = {};

export const Danger = Template.bind({});
Danger.args = {
  color: "danger",
};

export const Info = Template.bind({});
Info.args = {
  color: "info",
};

export const Warning = Template.bind({});
Warning.args = {
  color: "warning",
};
