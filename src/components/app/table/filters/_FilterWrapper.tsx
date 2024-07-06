/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { msg } from "@lingui/macro";
import type { ReactNode } from "react";
import type { SystemIconsKeys } from "shared/constants/Icons";
import type { TableFilterType } from "shared/types/data";

import { cn } from "@/lib/utils";

import { SoftButton } from "../../button/soft";
import { Dropdown } from "../../drop-down";
import { SystemIcon } from "../../system-icons";

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

export function FilterWrapper({
  children,
  filterHasValue,
  clearFilter,
  columnLabel,
  filterType,
}: IProps) {
  const { systemIcon, label: filterLabel } = FILTER_TYPE_CONFIG[filterType];

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <Dropdown
        className="w-64"
        ariaLabel={`Filter ${columnLabel} By ${filterLabel}${
          filterHasValue ? " Is Active" : ""
        }`}
        target={
          <SystemIcon
            icon={systemIcon}
            className={cn("size-4 align-text-top text-muted", {
              "text-primary": filterHasValue,
              "opacity-70": !filterHasValue,
            })}
          />
        }
      >
        <div className="flex flex-col gap-3 p-2">
          <div className="flex flex-col gap-3 text-left">{children}</div>
          <SoftButton
            action={() => {
              clearFilter(undefined);
            }}
            size="sm"
            systemIcon="Close"
            label={msg`Reset`}
          />
        </div>
      </Dropdown>
    </span>
  );
}
