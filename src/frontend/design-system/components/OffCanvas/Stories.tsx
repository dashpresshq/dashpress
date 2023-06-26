/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { useState } from "@storybook/addons";
import { OffCanvas, IProps } from ".";
import { ApplicationRoot } from "../../ApplicationRoot";

export default {
  title: "Components/OffCanvas",
  component: OffCanvas,
  args: {
    title: "Some awesome off canvas",
    children: (
      <p>
        Some text as placeholder. In real life you can have the elements you
        have chosen. Like, text, images, lists, etc.
      </p>
    ),
  },
};

const Template: Story<IProps> = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <ApplicationRoot>
      <button type="button" onClick={() => setOpen(true)}>
        Open Canvas
      </button>
      <OffCanvas {...args} show={open} onClose={() => setOpen(false)} />
    </ApplicationRoot>
  );
};

export const Default = Template.bind({});
Default.args = {};
