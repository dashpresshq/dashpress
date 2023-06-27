import React from "react";
import styled from "styled-components";
import { Loader, X } from "react-feather";
import { randomNumber } from "frontend/lib/numbers";
import { EmptyWrapper } from "../EmptyWrapper";
import { StyledOutlineButton } from "../Button/Button";
import { BaseSkeleton } from "../Skeleton/Base";
import { Spin } from "../_/Spin";

export interface ITagItem {
  id: string;
  label?: string;
}

export interface IProps {
  items: ITagItem[];
  onDelete: (id: string) => void;
  isLoading: boolean;
  isMakingDeleteRequestForId?: string;
  entityName: string;
}

const StyledWrapper = styled.div`
  padding-top: 0.5rem;
`;

const StyledButtonGroup = styled.div`
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  padding-left: 0px;
`;

const renderIcon = ({
  isMakingDeleteRequestForId,
  id,
}: {
  isMakingDeleteRequestForId?: string;
  id: string;
}) => {
  if (!id) {
    return <Spin as={Loader} size={14} />;
  }
  if (isMakingDeleteRequestForId === id) {
    return <Spin as={Loader} size={14} color="red" />;
  }
  return <X size={12} />;
};

export function TagsList({
  items,
  onDelete,
  isLoading,
  entityName,
  isMakingDeleteRequestForId,
}: IProps) {
  if (isLoading) {
    return (
      <StyledWrapper>
        {Array.from({ length: 10 }, (_, k) => k).map((key) => (
          <BaseSkeleton
            key={key}
            height="30px"
            width={`${randomNumber(50, 120)}px`}
            bottom={8}
            top={4}
            style={{
              float: "left",
              marginRight: ".75rem",
            }}
          />
        ))}
      </StyledWrapper>
    );
  }
  if (items.length === 0) {
    return <EmptyWrapper text={`No ${entityName} Selected Yet`} />;
  }

  return (
    <StyledWrapper>
      {items
        .filter(({ label }) => label)
        .map(({ label, id }) => (
          <StyledButtonGroup key={id} className="btn-group btn-sm">
            <StyledOutlineButton size="sm" type="button">
              {label}
            </StyledOutlineButton>
            <StyledOutlineButton
              size="sm"
              color="danger"
              disabled={!!isMakingDeleteRequestForId}
              onClick={() => {
                onDelete(id);
              }}
            >
              {renderIcon({ isMakingDeleteRequestForId, id })}
            </StyledOutlineButton>
          </StyledButtonGroup>
        ))}
    </StyledWrapper>
  );
}
