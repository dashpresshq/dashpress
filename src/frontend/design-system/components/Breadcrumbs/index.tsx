import React from "react";
import Link from "next/link";
import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { ILabelValue } from "shared/types/options";

const Breadcrumb = styled.ol`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  list-style: none;
  position: relative;
  border-radius: 0.25rem;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 0;
  background-color: transparent;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  color: ${USE_ROOT_COLOR("muted-text")};

  & + & {
    padding-left: 0.3rem;

    &:hover {
      &::before {
        text-decoration: none;
      }
    }

    &::before {
      display: inline-block;
      padding-right: 0.3rem;
      color: ${USE_ROOT_COLOR("muted-text")};
      content: "/";
    }
  }
`;

const BreadcrumbItemLink = styled.button<{ active: boolean }>`
  font-weight: 400;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  color: ${USE_ROOT_COLOR("primary-color")};

  ${(props) =>
    props.active &&
    css`
      color: ${USE_ROOT_COLOR("muted-text")};
    `}
`;

export interface IProps {
  items: ILabelValue[];
  onCrumbClick: (index: number) => void;
}

export function Breadcrumbs({ items, onCrumbClick }: IProps) {
  const itemsLength = items.length;
  return (
    <Breadcrumb>
      {items.map(({ label, value }, index) => {
        const isLastElement = index === itemsLength - 1;
        return (
          <BreadcrumbItem key={value}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLastElement ? (
              label
            ) : onCrumbClick ? (
              <BreadcrumbItemLink
                active={isLastElement}
                onClick={() => onCrumbClick(index)}
              >
                {label}
              </BreadcrumbItemLink>
            ) : (
              <Link href={value} passHref>
                <BreadcrumbItemLink active={isLastElement}>
                  {label}
                </BreadcrumbItemLink>
              </Link>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
