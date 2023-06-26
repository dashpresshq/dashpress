import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "../../theme/root";

export const StyledTh = styled.th<{ $isSortable?: boolean }>`
  padding: 8px;
  vertical-align: middle;
  color: ${USE_ROOT_COLOR("main-text")};
  &:not(:last-child) {
    border-right: 1px solid ${USE_ROOT_COLOR("border-color")};
  }
  ${(props) =>
    props.$isSortable &&
    css`
      cursor: pointer;
    `}
`;
