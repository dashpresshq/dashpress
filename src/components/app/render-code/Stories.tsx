/* eslint-disable react/function-component-definition */

import { TestProviders } from "__tests__/_/Provider";
import type { Story } from "@storybook/react";

import type { IProps } from ".";
import { RenderCode } from ".";

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
    <TestProviders>
      <RenderCode {...args} />
    </TestProviders>
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
