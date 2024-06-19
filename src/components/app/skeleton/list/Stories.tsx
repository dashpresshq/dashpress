/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { TestProviders } from "__tests__/_/Provider";
import { ListSkeleton, IProps } from ".";

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
