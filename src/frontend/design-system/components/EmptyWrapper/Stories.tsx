/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { EmptyWrapper, IProps } from ".";

export default {
  title: "Components/EmptyWrapper",
  component: EmptyWrapper,
  args: {
    text: "Some empty message for you",
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <EmptyWrapper {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: (
    <>
      <b>This is bold</b> This is not
    </>
  ),
};
