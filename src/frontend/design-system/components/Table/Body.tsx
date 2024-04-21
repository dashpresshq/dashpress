import { flexRender, Table } from "@tanstack/react-table";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { EmptyWrapper } from "../EmptyWrapper";
import { IEmptyWrapperProps } from "../EmptyWrapper/types";

const Td = styled.td`
  padding: 0.45rem;
  vertical-align: middle;
  font-weight: 400;

  &:not(:last-child) {
    border-right: 1px solid ${USE_ROOT_COLOR("border-color")};
  }
`;

const BodyTR = styled.tr<{ $hoverColor: string }>`
  padding: 4px;
  border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};
  page-break-inside: avoid;
  .show-on-hover {
    opacity: 0;
  }
  &:hover {
    background-color: ${(props) => props.$hoverColor};
    .show-on-hover {
      opacity: 1;
    }
  }
`;

interface IProps {
  table: Table<Record<string, unknown>>;
  dataLength: number;
  isLoading: boolean;
  empty: IEmptyWrapperProps;
}

export function TableBody({ table, dataLength, empty, isLoading }: IProps) {
  const colorShade = useThemeColorShade();
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <BodyTR key={row.id} $hoverColor={colorShade("base-color", 2)}>
          {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Td>
          ))}
        </BodyTR>
      ))}
      {dataLength === 0 ? (
        <BodyTR $hoverColor={colorShade("base-color", 2)}>
          <Td colSpan={10000}>
            {isLoading ? (
              <div style={{ height: "204px" }} />
            ) : (
              <EmptyWrapper {...{ ...empty }} />
            )}
          </Td>
        </BodyTR>
      ) : null}
    </tbody>
  );
}
