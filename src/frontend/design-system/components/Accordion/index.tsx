import React, { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import { ChevronDown, ChevronUp, Icon } from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

const ARROW_SIZE = 16;

export interface IProps {
  icon: Icon;
  name: string;
  body: ReactNode;
  highlight?: boolean;
}

const StyledAnchor = styled.button`
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0.5rem;
  background: inherit;
  border: 0;
  width: 100%;
  &:focus {
    outline: 0;
  }
`;

const StyledBodyWrapper = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
  border-top: 1px solid ${USE_ROOT_COLOR("border-color")};
`;

const StyledLabelIcon = styled.i`
  margin-right: 0.5rem;
`;

const StyledIcon = styled.i<{ highlight?: boolean }>`
  margin-top: 0.3rem;
  color: ${(props) =>
    props.highlight
      ? USE_ROOT_COLOR("text-on-primary")
      : USE_ROOT_COLOR("main-text")};
`;

const Root = styled.div<{ highlight?: boolean }>`
  padding: 0;
  ${(props) =>
    props.highlight &&
    css`
      background: ${USE_ROOT_COLOR("primary-color")}};
    `};
  border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};
  margin-bottom: 1px;
`;

const StyledLabel = styled.p<{ highlight?: boolean }>`
  margin-bottom: 0;
  font-size: 16px;
  color: ${(props) =>
    props.highlight
      ? USE_ROOT_COLOR("text-on-primary")
      : USE_ROOT_COLOR("main-text")};
`;

export function AccordionItem({ icon, name, body, highlight }: IProps) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  return (
    <Root highlight={highlight}>
      <StyledAnchor
        onClick={() => {
          setIsBoxOpen(!isBoxOpen);
        }}
      >
        <StyledLabel highlight={highlight}>
          <StyledLabelIcon as={icon} size={ARROW_SIZE} />
          {name}
        </StyledLabel>
        <StyledIcon
          highlight={highlight}
          as={isBoxOpen ? ChevronUp : ChevronDown}
          size={ARROW_SIZE}
        />
      </StyledAnchor>
      {isBoxOpen ? <StyledBodyWrapper> {body} </StyledBodyWrapper> : null}
    </Root>
  );
}
