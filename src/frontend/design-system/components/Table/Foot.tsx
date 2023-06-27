import { flexRender, Table } from "@tanstack/react-table";
import React from "react";
import styled from "styled-components";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Text";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { StyledTh } from "./styles";

const SHOW_FOOTER_THRESHOLD = 20;

const StyledTFoot = styled.tfoot`
  background-color: ${USE_ROOT_COLOR("soft-color")};
`;

interface IProps {
  table: Table<Record<string, unknown>>;
  dataLength: number;
}

export function TableFoot({ table, dataLength }: IProps) {
  if (dataLength < SHOW_FOOTER_THRESHOLD) {
    return null;
  }
  return (
    <StyledTFoot>
      {table.getFooterGroups().map((footerGroup) => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <StyledTh key={header.id}>
              <Stack justify="start">
                <Typo.SM weight="bold" as="span">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </Typo.SM>
              </Stack>
            </StyledTh>
          ))}
        </tr>
      ))}
    </StyledTFoot>
  );
}
