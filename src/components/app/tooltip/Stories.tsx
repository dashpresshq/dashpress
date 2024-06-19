/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { TestProviders } from "__tests__/_/Provider";
import { Tooltip, IProps } from ".";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    text: "I am a tooltip content",
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <Tooltip {...args}>Hover over me</Tooltip>
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const Right = Template.bind({});
Right.args = {
  place: "right",
};

export const Offset = Template.bind({});
Offset.args = {
  place: "right",
  offset: 30,
};
