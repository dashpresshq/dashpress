/* eslint-disable react/function-component-definition */

import { TestProviders } from "__tests__/_/Provider";
import type { Story } from "@storybook/react";

import type { IProps } from ".";
import { TableSkeleton } from ".";

export default {
  title: "Components/Skeleton/Table",
  component: TableSkeleton,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <TableSkeleton {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const Lean = Template.bind({});
Lean.args = {
  lean: true,
};
