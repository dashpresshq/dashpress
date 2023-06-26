/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { FormSkeleton, FormSkeletonSchema, IProps } from ".";
import { ApplicationRoot } from "../../../ApplicationRoot";

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
