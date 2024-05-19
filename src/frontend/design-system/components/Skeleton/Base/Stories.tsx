/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { TestProviders } from "__tests__/_/Provider";
import { BaseSkeleton, IProps } from ".";

export default {
  title: "Components/Skeleton/Base",
  component: BaseSkeleton,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <BaseSkeleton {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const FullWidth = Template.bind({});
FullWidth.args = {
  height: "200px",
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  height: "200px",
  width: "200px",
};
