/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TableDataAsList, IProps } from ".";
import { ApplicationRoot } from "../../ApplicationRoot";

export default {
  title: "Components/TableDataAsList",
  component: TableDataAsList,
  args: {
    onSelect: action("onSelect"),
    data: [
      {
        label: "Foo Label",
        value: "Foo Value",
      },
      {
        label: "Bar Label",
        value: "Bar Value",
      },
      {
        label: "Baz Label",
        value: "Baz Value",
      },
    ],
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <TableDataAsList {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
