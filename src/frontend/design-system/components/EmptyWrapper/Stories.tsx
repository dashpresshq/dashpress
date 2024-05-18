/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { noop } from "shared/lib/noop";
import { TestProviders } from "__tests__/_/Provider";
import { EmptyWrapper } from ".";
import { IEmptyWrapperProps } from "./types";

export default {
  title: "Components/EmptyWrapper",
  component: EmptyWrapper,
  args: {
    text: "Some empty message for you",
  },
};

const Template: Story<IEmptyWrapperProps> = (args) => (
  <TestProviders>
    <EmptyWrapper {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const WithCreateNew = Template.bind({});
WithCreateNew.args = {
  createNew: {
    label: "Add New Item",
    action: () => noop(),
  },
};
