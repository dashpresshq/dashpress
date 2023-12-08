import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

export const Divider = styled.div`
  border-top: 2px solid ${USE_ROOT_COLOR("border-color")};
`;
