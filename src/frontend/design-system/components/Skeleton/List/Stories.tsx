/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ListSkeleton, IProps } from ".";
import { ApplicationRoot } from "../../../ApplicationRoot";

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
