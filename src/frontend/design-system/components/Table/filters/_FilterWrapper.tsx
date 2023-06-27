/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ReactNode } from "react";
import { Icon, ToggleLeft, Filter, Search, Calendar } from "react-feather";
import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Dropdown } from "../../Dropdown";
import { SoftButton } from "../../Button/SoftButton";
import { TableFilterType } from "./types";

const FILTER_TYPE_CONFIG: Record<
  TableFilterType["_type"],
  { label: string; IconComponent: Icon }
> = {
  boolean: { IconComponent: ToggleLeft, label: "Boolean" },
  idField: { IconComponent: Filter, label: "Id" },
  number: { IconComponent: Filter, label: "Number" },
  string: { IconComponent: Search, label: "Search" },
  status: { IconComponent: Filter, label: "Status" },
  date: { IconComponent: Calendar, label: "Date" },
  list: { IconComponent: Filter, label: "List" },
};

interface IProps {
  children: ReactNode;
  filterHasValue: boolean;
  clearFilter: (filter: undefined) => void;
  filterType: TableFilterType["_type"];
  columnLabel: ReactNode;
}

const Root = styled.div`
  cursor: pointer;
  line-height: 0;
`;

const DownRoot = styled(Stack)`
  padding: 8px;
  min-width: 250px;
`;

export function FilterWrapper({
  children,
  filterHasValue,
  clearFilter,
  columnLabel,
  filterType,
}: IProps) {
  const iconProps = {
    size: 15,
    color: filterHasValue
      ? USE_ROOT_COLOR("primary-color")
      : USE_ROOT_COLOR("muted-text"),
    style: { opacity: filterHasValue ? 1 : 0.7 },
  };

  const { IconComponent, label: filterLabel } = FILTER_TYPE_CONFIG[filterType];

  return (
    <Dropdown
      width={250}
      preserveVisibiltyOnClick
      align="right"
      target={
        <Root
          aria-label={`Filter ${columnLabel} By ${filterLabel}${
            filterHasValue ? " Is Active" : ""
          }`}
        >
          <IconComponent {...iconProps} />
        </Root>
      }
    >
      <DownRoot direction="column">
        <div style={{ textAlign: "left" }}>{children}</div>
        <SoftButton
          action={() => {
            clearFilter(undefined);
          }}
          block
          size="xs"
          icon="close"
          label="Reset"
        />
      </DownRoot>
    </Dropdown>
  );
}
