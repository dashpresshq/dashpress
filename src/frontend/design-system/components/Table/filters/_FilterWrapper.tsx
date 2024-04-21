/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactNode } from "react";
import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { TableFilterType } from "shared/types/data";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { SystemIconsKeys } from "shared/constants/Icons";
import { Dropdown } from "../../Dropdown";
import { SoftButton } from "../../Button/SoftButton";

const FILTER_TYPE_CONFIG: Record<
  TableFilterType["_type"],
  { label: string; systemIcon: SystemIconsKeys }
> = {
  boolean: { systemIcon: "ToggleLeft", label: "Boolean" },
  idField: { systemIcon: "Filter", label: "Id" },
  number: { systemIcon: "Filter", label: "Number" },
  string: { systemIcon: "Search", label: "Search" },
  status: { systemIcon: "Filter", label: "Status" },
  date: { systemIcon: "Calendar", label: "Date" },
  list: { systemIcon: "Filter", label: "List" },
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
  const { systemIcon, label: filterLabel } = FILTER_TYPE_CONFIG[filterType];

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
          <SystemIcon
            icon={systemIcon}
            size={15}
            color={filterHasValue ? "primary-color" : "muted-text"}
            style={{ opacity: filterHasValue ? 1 : 0.7 }}
          />
        </Root>
      }
    >
      <DownRoot $direction="column">
        <div style={{ textAlign: "left" }}>{children}</div>
        <SoftButton
          action={() => {
            clearFilter(undefined);
          }}
          block
          size="xs"
          systemIcon="Close"
          label="Reset"
        />
      </DownRoot>
    </Dropdown>
  );
}
