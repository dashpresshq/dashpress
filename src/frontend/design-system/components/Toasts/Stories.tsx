/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action as storyAction } from "@storybook/addon-actions";
import { ToastService } from "@hadmean/protozoa";
import { ApplicationRoot } from "../../ApplicationRoot";

interface IProps {
  label: string;
  action: () => void;
}

const Demo = ({ action, label }: IProps) => {
  return (
    <button type="button" onClick={action}>
      {label}
    </button>
  );
};

export default {
  title: "Components/Toast",
  component: Demo,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <Demo {...args} />
  </ApplicationRoot>
);

export const Success = Template.bind({});
Success.args = {
  label: "Toast Success",
  action: () => ToastService.success("App updated successfully"),
};

export const SuccessWithAction = Template.bind({});
SuccessWithAction.args = {
  label: "Toast Success With Action",
  action: () =>
    ToastService.success({
      message: "App updated successfully",
      action: {
        label: "Click me",
        action: () => storyAction("Click me"),
      },
    }),
};

export const Error = Template.bind({});
Error.args = {
  label: "Toast Error",
  action: () => ToastService.error("Some thing bad happened"),
};
