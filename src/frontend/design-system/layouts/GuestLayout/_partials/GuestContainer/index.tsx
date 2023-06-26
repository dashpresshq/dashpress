import React, { ReactNode } from "react";
import styled from "styled-components";
import { Stack } from "../../../../ui-blocks";
import { USE_ROOT_COLOR } from "../../../../theme";

const Root = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${USE_ROOT_COLOR("foundation-color")};
  background-image: radial-gradient(
    ${USE_ROOT_COLOR("primary-color")} 0.75px,
    ${USE_ROOT_COLOR("foundation-color")} 0.75px
  );
  background-size: 15px 15px;
`;

const StyledWrapperRow = styled(Stack)`
  height: 100vh;
`;

export function GuestContainer({ children }: { children: ReactNode }) {
  return (
    <Root>
      <StyledWrapperRow justify="center" align="center">
        {children}
      </StyledWrapperRow>
    </Root>
  );
}
