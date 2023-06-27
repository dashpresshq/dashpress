/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { SortList, IProps } from ".";

export default {
  title: "Components/SortList",
  component: SortList,
  args: {
    onSave: action("save"),
    data: {
      isLoading: false,
      error: "",
      data: [
        { value: "Planck", label: "Max Planck" },
        { value: "Faraday" },
        { value: "Newton" },
        { value: "Einstein" },
        { value: "Bohr" },
        { value: "Curie" },
      ],
    },
  },
};

const Template: Story<IProps<{ value: string; label?: string }>> = (args) => (
  <ApplicationRoot>
    <SortList {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const Loading = Template.bind({});
Loading.args = {
  data: {
    isLoading: true,
    data: [],
    error: "",
    isRefetching: false,
  },
};

export const Error = Template.bind({});
Error.args = {
  data: {
    isLoading: false,
    data: [],
    error: "Some Error",
    isRefetching: false,
  },
};

export const Empty = Template.bind({});
Empty.args = {
  data: {
    isLoading: false,
    data: [],
    error: "",
    isRefetching: false,
  },
};

export const SingleItem = Template.bind({});
SingleItem.args = {
  data: {
    isLoading: false,
    data: [{ value: "Foo" }],
    error: "",
    isRefetching: false,
  },
};
