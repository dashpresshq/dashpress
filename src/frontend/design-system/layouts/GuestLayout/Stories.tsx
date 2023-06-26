/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "../../ApplicationRoot";
import { GuestLayout, IProps } from ".";

export default {
  title: "Layout/GuestLayout",
  component: GuestLayout,
  args: {
    title: "Page Title",
    subTitle: "Some subtitle",
    children: <p>Layout Content Will Be Here</p>,
  } as IProps,
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <GuestLayout {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
