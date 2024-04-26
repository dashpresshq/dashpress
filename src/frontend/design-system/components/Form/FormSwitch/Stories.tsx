/* eslint-disable react/function-component-definition */
import { useState } from "react";
import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { FormSwitch, IProps } from ".";

function Demo(args: IProps) {
  const [value, setValue] = useState(true);
  return (
    <FormSwitch
      {...args}
      name="foo"
      onChange={setValue}
      value={value}
      label={{ id: "foo", message: "Fooo" }}
    />
  );
}

export default {
  title: "Components/FormSwitch",
  component: Demo,
  args: {},
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <Demo {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const LabelLess = Template.bind({});
LabelLess.args = {
  label: "",
};

export const Small = Template.bind({});
Small.args = {
  size: "sm",
};
