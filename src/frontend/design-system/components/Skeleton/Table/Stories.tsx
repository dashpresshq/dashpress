/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { TableSkeleton, IProps } from ".";
import { ApplicationRoot } from "../../../ApplicationRoot";

export default {
  title: "Components/Skeleton/Table",
  component: TableSkeleton,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <TableSkeleton {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const Lean = Template.bind({});
Lean.args = {
  lean: true,
};
