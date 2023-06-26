/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import { RenderList, IProps } from ".";
import { ApplicationRoot } from "../../ApplicationRoot";
import { SectionListItem } from "../Section/SectionList";

interface IDemoType {
  name: string;
}

export default {
  title: "Components/RenderList",
  component: RenderList,
  args: {
    items: [
      { name: "Planck", age: 27 },
      { name: "Faraday", age: 27 },
      { name: "Newton", age: 27 },
      { name: "Einstein", age: 27 },
      { name: "Bohr", age: 27 },
      { name: "Curie", age: 27 },
    ],
    render: ({ name }: IDemoType) => (
      <SectionListItem
        label={name}
        key={name}
        action={() => actions(`Clicking on ${name}`)}
      />
    ),
  },
};

const Template: Story<IProps<IDemoType>> = (args) => (
  <ApplicationRoot>
    <RenderList {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = {
  getLabel: (name) => `${name} - Label`,
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: 5,
};

export const NewItemLink = Template.bind({});
NewItemLink.args = {
  items: [],
  newItemLink: "/path/to/new/item",
};

export const Empty = Template.bind({});
Empty.args = {
  items: [],
};

export const NotSearchAble = Template.bind({});
NotSearchAble.args = {
  notSearchable: true,
};

export const Error = Template.bind({});
Error.args = {
  error: "An Error Occurred",
};

export const Sorted = Template.bind({});
Sorted.args = {
  sortByLabel: true,
};
