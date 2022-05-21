/** @jsxImportSource @emotion/react */
import React, { ReactNode, useState } from "react";
import {
  AtlassianNavigation,
  Create,
  Help,
  PrimaryButton,
  ProductHome,
} from "@atlaskit/atlassian-navigation";
import { ConfluenceIcon, ConfluenceLogo } from "@atlaskit/logo";
import { ButtonItem, MenuGroup, Section } from "@atlaskit/menu";
import Popup from "@atlaskit/popup";

import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
} from "@atlaskit/page-layout";
import { SlotLabel } from "./_components/SlotLabel";
import { SlotWrapper } from "./_components/SlotWrapper";
import { LeftNavigation } from "./_components/LeftNavigation";
import { INavigationItem } from "../types";

interface IProps {
  navigationItems?: INavigationItem[];
  children: ReactNode;
}

export const BaseLayout: React.FC<IProps> = ({ navigationItems = [], children }) => {
  return (
    <PageLayout>
      <TopNavigation
        isFixed={true}
        id="confluence-navigation"
        skipLinkTitle="Confluence Navigation"
      >
        <TopNavigationContents />
      </TopNavigation>
      <Content testId="content">
        {navigationItems.length > 0 && (
          <LeftSidebar
            isFixed={true}
            width={450}
            id="project-navigation"
            skipLinkTitle="Project Navigation"
            testId="left-sidebar"
          >
            <LeftNavigation navigationItems={navigationItems} />
          </LeftSidebar>
        )}
        <Main id="main-content" skipLinkTitle="Main Content">
          <SlotWrapper>
            <SlotLabel>{children}</SlotLabel>
          </SlotWrapper>
        </Main>
      </Content>
    </PageLayout>
  );
};

function TopNavigationContents() {
  return (
    <AtlassianNavigation
      label="site"
      moreLabel="More"
      primaryItems={[
        <PrimaryButton isHighlighted>Item 1</PrimaryButton>,
        <PrimaryButton>Item 2</PrimaryButton>,
        <PrimaryButton>Item 3</PrimaryButton>,
        <PrimaryButton>Item 4</PrimaryButton>,
      ]}
      renderProductHome={ProductHomeExample}
      renderCreate={DefaultCreate}
      renderHelp={HelpPopup}
    />
  );
}

/*
 * Components for composing top and side navigation
 */

export const DefaultCreate = () => (
  <Create
    buttonTooltip="Create"
    iconButtonTooltip="Create"
    onClick={() => {}}
    text="Create"
  />
);

const ProductHomeExample = () => (
  <ProductHome
    onClick={console.log}
    icon={ConfluenceIcon}
    logo={ConfluenceLogo}
    siteTitle="Product"
  />
);

export const HelpPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={HelpPopupContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Help
          isSelected={isOpen}
          onClick={onClick}
          tooltip="Help"
          {...triggerProps}
        />
      )}
    />
  );
};

const HelpPopupContent = () => (
  <MenuGroup>
    <Section title={"Menu Heading"}>
      <ButtonItem>Item 1</ButtonItem>
      <ButtonItem>Item 2</ButtonItem>
      <ButtonItem>Item 3</ButtonItem>
      <ButtonItem>Item 4</ButtonItem>
    </Section>
    <Section title="Menu Heading with separator" hasSeparator>
      <ButtonItem>Item 5</ButtonItem>
      <ButtonItem>Item 6</ButtonItem>
    </Section>
  </MenuGroup>
);
