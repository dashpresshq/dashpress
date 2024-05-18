/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { MoreVertical } from "react-feather";
import { TestProviders } from "__tests__/_/Provider";
import { Dropdown, IProps } from ".";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  args: {
    target: <MoreVertical />,
    children: <div>Hello world</div>,
    onDropDownActiveChange: action("onDropDownActiveChange"),
  },
};

const Template: Story<IProps> = (args) => (
  <TestProviders>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Dropdown {...args} width={200} />
    </div>
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};

export const PreserveClick = Template.bind({});
PreserveClick.args = {
  preserveVisibiltyOnClick: true,
};

export const Left = Template.bind({});
Left.args = {
  align: "left",
};
