/* eslint-disable react/function-component-definition */

import type { Story } from "@storybook/react";

import { TestProviders } from "@/tests/Provider";

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
