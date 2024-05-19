/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TestProviders } from "__tests__/_/Provider";
import { ConfirmAlert } from ".";

export default {
  title: "Components/ConfirmAlert",
  component: ConfirmAlert,
  args: {
    action: action("action"),
    onClose: action("onClose"),
    title: "Wanna do this",
    message: "This is irrevisble",
  },
};

const Template: Story = (args) => (
  <TestProviders>
    <ConfirmAlert {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};
