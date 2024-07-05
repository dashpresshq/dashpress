/* eslint-disable react/function-component-definition */

import type { Story } from "@storybook/react";
import { actions } from "@storybook/addon-actions";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { TestProviders } from "__tests__/_/Provider";
import type { IProps } from ".";
import { ListManager } from ".";

interface IDemoType {
  name: string;
}

export default {
  title: "Components/ListManager",
  component: ListManager,
  args: {
    items: loadedDataState([
      { name: "Planck", age: 27 },
      { name: "Faraday", age: 27 },
      { name: "Newton", age: 27 },
      { name: "Einstein", age: 27 },
      { name: "Bohr", age: 27 },
      { name: "Curie", age: 27 },
    ]),
    labelField: "name",
    render: ({ name }: IDemoType) => ({
      label: name,
      key: name,
      action: () => actions(`Clicking on ${name}`),
    }),
  },
};

const Template: Story<IProps<IDemoType, "name">> = (args) => (
  <TestProviders>
    <ListManager {...args} />
  </TestProviders>
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

export const Empty = Template.bind({});
Empty.args = {
  items: [],
};

export const Error = Template.bind({});
Error.args = {
  error: "An Error Occurred",
};
