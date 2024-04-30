/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { RenderCode, IProps } from ".";

export default {
  title: "Components/RenderCode",
  component: RenderCode,
  args: {
    input: {
      hello: {
        there: "how are you",
      },
      foo: ["bar", "baz", "bax"],
    },
  },
};

const Template: Story<IProps> = (args) => {
  return (
    <ApplicationRoot>
      <RenderCode {...args} />
    </ApplicationRoot>
  );
};

export const JavascriptObject = Template.bind({});
JavascriptObject.args = {};

export const JavascriptScript = Template.bind({});
JavascriptScript.args = {
  input: `
  /*
  Example
  */
  const foo = () => {
    return bar;
  }
  `,
};
