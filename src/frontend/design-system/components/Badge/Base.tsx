import styled from "styled-components";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";

export const StyledBadge = styled.span<{ color: keyof typeof SYSTEM_COLORS }>`
  display: inline-block;
  padding: 0.36em 0.4em;
  font-weight: 400;
  line-height: 1;
  box-shadow: none;
  font-size: 11px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
