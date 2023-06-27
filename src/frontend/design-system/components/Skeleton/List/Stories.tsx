/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { ListSkeleton, IProps } from ".";

export default {
  title: "Components/Skeleton/List",
  component: ListSkeleton,
  args: {
    count: 5,
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <ListSkeleton {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
