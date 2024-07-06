/* eslint-disable react/function-component-definition */

import { TestProviders } from "__tests__/_/Provider";
import type { Story } from "@storybook/react";

import type { IProps } from ".";
import { ListSkeleton } from ".";

export default {
  title: "Components/Skeleton/List",
  component: ListSkeleton,
  args: {
    count: 5,
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <ListSkeleton {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};
