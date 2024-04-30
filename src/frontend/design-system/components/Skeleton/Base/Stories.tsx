/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { BaseSkeleton, IProps } from ".";

export default {
  title: "Components/Skeleton/Base",
  component: BaseSkeleton,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <BaseSkeleton {...args} />
  </ApplicationRoot>
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
