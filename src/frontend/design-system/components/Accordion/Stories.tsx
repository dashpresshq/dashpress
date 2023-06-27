/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { AlertOctagon } from "react-feather";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { AccordionItem, IProps } from ".";

export default {
  title: "Components/AccordionItem",
  component: AccordionItem,
  args: {
    icon: AlertOctagon,
    name: "Foo Title",
    body: <>Some body content</>,
  },
};

const Template: Story<IProps> = (args) => (
  <ApplicationRoot>
    <AccordionItem {...args} highlight name="Highlighted" />
    <AccordionItem {...args} />
    <AccordionItem {...args} />
    <AccordionItem {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
