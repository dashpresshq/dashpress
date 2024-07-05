/* eslint-disable react/function-component-definition */

import { TestProviders } from "__tests__/_/Provider";
import type { Story } from "@storybook/react";

import { ContentLayout } from ".";

export default {
  title: "Components/ContentLayout",
  component: ContentLayout,
  args: {
    title: "Section Title",
    children: <p>Content of the section</p>,
  },
};

const Template: Story = () => (
  <TestProviders>
    <ContentLayout.Center>
      <div className="size-full bg-red-500">Hello</div>
    </ContentLayout.Center>
    <br />
    <ContentLayout>
      <ContentLayout.Left>
        <div className="size-full bg-green-500">Left</div>
      </ContentLayout.Left>
      <ContentLayout.Right>
        <div className="size-full bg-blue-500">Right</div>
      </ContentLayout.Right>
    </ContentLayout>
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};
