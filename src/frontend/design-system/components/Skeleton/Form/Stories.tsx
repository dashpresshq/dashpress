/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
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
  <ApplicationRoot>
    <FormSkeleton {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
