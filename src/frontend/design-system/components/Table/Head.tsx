import { flexRender, Table } from "@tanstack/react-table";
import * as React from "react";
import { ArrowUp } from "react-feather";
import styled, { css } from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { TableFilter } from "./filters";
import { TableFilterType } from "./filters/types";
import { StyledTh } from "./styles";

const StyledTHead = styled.thead`
  background-color: ${USE_ROOT_COLOR("soft-color")};
`;

interface IColumnMeta {
  filter?: TableFilterType;
}

const StyledSorting = styled(ArrowUp)<{ $isSorted: boolean; $isDesc: boolean }>`
  color: ${USE_ROOT_COLOR("muted-text")};
  opacity: 0.7;
  cursor: pointer;
  margin-left: 0px;
  transition: transform 0.3s;
  ${(props) => props.$isDesc && "transform: rotate(180deg);"}

  ${(props) =>
    props.$isSorted &&
    css`
      color: ${USE_ROOT_COLOR("primary-color")};
      opacity: 1;
    `}
`;

interface IProps {
  table: Table<Record<string, unknown>>;
}

export function TableHead({ table }: IProps) {
  return (
    <StyledTHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const view = flexRender(
              header.column.columnDef.header,
              header.getContext()
            );
            const { filter } = header.column.columnDef.meta as IColumnMeta;
            const isSorted = header.column.getIsSorted();
            return (
              <StyledTh
                key={header.id}
                $isSortable={header.column.getCanSort()}
                onClick={header.column.getToggleSortingHandler()}
              >
                <Stack justify="space-between" align="center" spacing={0}>
                  <Typo.SM weight="bold" as="span">
                    {header.isPlaceholder ? null : view}
                  </Typo.SM>
                  <Stack justify="end" width="auto" align="center" spacing={0}>
                    {header.column.getCanSort() && (
                      <StyledSorting
                        size={18}
                        aria-label={`Sort By ${view} ${
                          // eslint-disable-next-line no-nested-ternary
                          isSorted ? (isSorted === "desc" ? "Desc" : "Asc") : ""
                        }`}
                        $isSorted={!!isSorted}
                        $isDesc={isSorted === "desc"}
                      />
                    )}
                    {header.column.getCanFilter() && filter ? (
                      <TableFilter
                        view={view}
                        column={header.column}
                        type={filter}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              </StyledTh>
            );
          })}
        </tr>
      ))}
    </StyledTHead>
  );
}
