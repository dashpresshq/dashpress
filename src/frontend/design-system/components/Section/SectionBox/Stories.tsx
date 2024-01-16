/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { SectionBox, IProps } from ".";

export default {
  title: "Components/SectionBox",
  component: SectionBox,
  args: {
    title: "Section Title",
    children: <p>Content of the section</p>,
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <SectionBox {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};

export const WithDescription = Template.bind({});
WithDescription.args = {
  description: "Some help text for you",
};

export const WithActionButtons = Template.bind({});
WithActionButtons.args = {
  actionButtons: [
    {
      action: "/foo",
      label: "Add Me",
      systemIcon: "Plus",
    },
    {
      action: "/baz",
      systemIcon: "Help",
      label: "Link to help",
    },
    {
      action: "/baz",
      label: "Bar",
    },
  ],
};

export const WithSelection = Template.bind({});
WithSelection.args = {
  selection: {
    onChange: action("on change"),
    options: [
      {
        label: "Foo",
        value: "foo",
      },
      {
        label: "Bar",
        value: "bar",
      },
    ],
  },
};

export const WithDeleteAction = Template.bind({});
WithDeleteAction.args = {
  deleteAction: {
    action: action("delete"),
    isMakingDeleteRequest: false,
  },
};

export const WithDeleteActionInProgress = Template.bind({});
WithDeleteActionInProgress.args = {
  deleteAction: {
    action: action("delete"),
    isMakingDeleteRequest: true,
  },
};

export const WithDeleteActionAndActionButtons = Template.bind({});
WithDeleteActionAndActionButtons.args = {
  deleteAction: {
    action: action("delete"),
    isMakingDeleteRequest: false,
  },
  actionButtons: [
    {
      action: "/foo",
      label: "Foo",
      systemIcon: "Plus",
    },
    {
      action: "/bar",
      label: "Bar",
      icon: "close",
    },
  ],
};

export const WithBackLink = Template.bind({});
WithBackLink.args = {
  backLink: {
    action: action("delete"),
    label: "Go Back",
  },
};

export const IsLoading = Template.bind({});
IsLoading.args = {
  isLoading: true,
};

export const HeadLess = Template.bind({});
HeadLess.args = {
  headLess: true,
};

export const EveryThing = Template.bind({});
EveryThing.args = {
  description: "Some help text for you",
  actionButtons: [
    {
      action: "/foo",
      label: "Foo",
      systemIcon: "Plus",
    },
    {
      action: "/foo",
      icon: "settings",
    },
    {
      action: "/foo",
      label: "Bar",
    },
  ],
  selection: {
    onChange: action("on change"),
    options: [
      {
        label: "Foo",
        value: "foo",
      },
      {
        label: "Bar",
        value: "bar",
      },
    ],
  },
  deleteAction: {
    action: action("delete"),
    isMakingDeleteRequest: false,
  },
  backLink: {
    action: action("delete"),
    label: "Go Back",
  },
};
