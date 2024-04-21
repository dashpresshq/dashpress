/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
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
  <ApplicationRoot>
    <ContentLayout.Center>
      <div style={{ width: "100%", height: "100px", background: "red" }}>
        Hello
      </div>
    </ContentLayout.Center>
    <br />
    <ContentLayout>
      <ContentLayout.Left>
        <div style={{ width: "100%", height: "100px", background: "green" }}>
          Left
        </div>
      </ContentLayout.Left>
      <ContentLayout.Right>
        <div style={{ width: "100%", height: "100px", background: "blue" }}>
          Right
        </div>
      </ContentLayout.Right>
    </ContentLayout>
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
