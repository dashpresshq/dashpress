/* eslint-disable react/function-component-definition */

import type { Story } from "@storybook/react";

import { TestProviders } from "@/tests/Provider";

import type { IProps } from ".";
import { FormSkeleton, FormSkeletonSchema } from ".";

export default {
  title: "Components/Skeleton/Form",
  component: FormSkeleton,
  args: {
    schema: [
      FormSkeletonSchema.Input,
      FormSkeletonSchema.Input,
      FormSkeletonSchema.RichTextArea,
      FormSkeletonSchema.Textarea,
    ],
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <FormSkeleton {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};
