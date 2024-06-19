/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { TestProviders } from "__tests__/_/Provider";
import { FormSkeleton, FormSkeletonSchema, IProps } from ".";

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
