import { useState, useEffect, ReactNode } from "react";
import styled, { css } from "styled-components";
import RBTab from "react-bootstrap/Tab";
import RBTabs from "react-bootstrap/Tabs";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { sluggify } from "shared/lib/strings";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";

const Root = styled.div<{ $padContent: boolean }>`
  .nav {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin: 0;
    list-style: none;
    border-bottom: 2px solid ${USE_ROOT_COLOR("border-color")};
  }

  .tab-pane {
    display: none;
    &.show {
      display: block;
    }
  }

  .nav-item {
    margin-bottom: -1px;
  }

  .tab-content {
    ${(props) =>
      props.$padContent &&
      css`
        padding-top: 1rem;
      `}
  }

  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
    background-color: ${USE_ROOT_COLOR("base-color")};
    border: 1px solid transparent;
    border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    color: ${USE_ROOT_COLOR("main-text")};

    &.disabled {
      color: ${USE_ROOT_COLOR("muted-text")} !important;
    }

    &.active {
      color: ${USE_ROOT_COLOR("primary-color")};
      background-color: ${USE_ROOT_COLOR("base-color")};
      border-color: transparent transparent ${USE_ROOT_COLOR("primary-color")};
    }
  }
`;

export interface IProps {
  contents: {
    label: MessageDescriptor;
    overrideLabel?: MessageDescriptor;
    disabled?: boolean;
    content: ReactNode;
  }[];
  currentTab?: string;
  padContent?: boolean;
  lazy?: true;
  onChange?: (tab: string) => void;
}

export function Tabs({
  contents,
  currentTab,
  onChange,
  lazy,
  padContent = true,
}: IProps) {
  const { _ } = useLingui();

  const [activeTab, setActiveTab$1] = useState<string>(
    sluggify(currentTab || _(contents[0].label))
  );

  const setActiveTab = (label: string) => {
    setActiveTab$1(sluggify(label));
  };

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab);
    } else {
      setActiveTab(_(contents[0].label));
    }
  }, [currentTab, JSON.stringify(contents.map((content) => content.label))]);

  const changeTab = (tabLabel: string | null) => {
    if (!tabLabel) {
      return;
    }
    if (activeTab !== tabLabel) {
      setActiveTab(tabLabel);
      onChange?.(tabLabel);
    }
  };

  return (
    <Root $padContent={padContent}>
      <RBTabs
        defaultActiveKey={activeTab}
        activeKey={activeTab}
        onSelect={changeTab}
        mountOnEnter={lazy}
      >
        {contents.map(({ label, overrideLabel, disabled, content }) => (
          <RBTab
            eventKey={sluggify(_(label))}
            key={sluggify(_(label))}
            title={_(overrideLabel || label)}
            tabClassName={disabled ? "disabled" : ""}
          >
            {content}
          </RBTab>
        ))}
      </RBTabs>
    </Root>
  );
}
