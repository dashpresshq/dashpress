import React, { ReactNode } from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";

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

const WrapperRow = styled(Stack)`
  height: 100vh;
`;

export function GuestContainer({ children }: { children: ReactNode }) {
  return (
    <Root>
      <WrapperRow justify="center" align="center">
        {children}
      </WrapperRow>
    </Root>
  );
}
