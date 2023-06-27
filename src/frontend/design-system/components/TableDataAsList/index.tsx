import styled, { css } from "styled-components";
import { Edit } from "react-feather";
import React from "react";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

export interface IProps {
  onSelect: () => void;
  data: { label: string; value: string }[];
}

const EditButton = styled.span`
  color: ${USE_ROOT_COLOR("primary-color")};
  cursor: pointer;
  position: absolute;
  right: 1rem;
  margin-top: 0.25rem;
`;

const StyledLabel = styled.p`
  color: ${USE_ROOT_COLOR("muted-text")};
  margin-bottom: 0;
  font-size: 11px;
`;

const StyledValue = styled.p`
  color: ${USE_ROOT_COLOR("main-text")};
  margin-bottom: 0;
`;

const StyledBlockWrapper = styled.div`
  background: ${USE_ROOT_COLOR("soft-color")};
  margin-top: 0.5rem;
  padding: 0.25rem 0.25rem;
  border-radius: 5px;
`;

const StyledDataWrapper = styled.div<{ isLastChild: boolean }>`
  ${({ isLastChild }) =>
    !isLastChild &&
    css`
      border-bottom: 1px dashed ${USE_ROOT_COLOR("border-color")};
    `}
`;

export function TableDataAsList({ data, onSelect }: IProps) {
  return (
    <StyledBlockWrapper>
      <EditButton as={Edit} size="13" onClick={onSelect} />
      {data.map(({ label, value }, schemaIndex) => (
        <StyledDataWrapper
          key={label}
          isLastChild={schemaIndex === data.length - 1}
        >
          <StyledLabel>{label}</StyledLabel>
          <StyledValue>{value}</StyledValue>
        </StyledDataWrapper>
      ))}
    </StyledBlockWrapper>
  );
}
