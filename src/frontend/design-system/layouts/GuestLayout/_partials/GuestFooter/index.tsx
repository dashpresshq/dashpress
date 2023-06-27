import React from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { StyledCardBody } from "frontend/design-system/components/Card";

const Root = styled(StyledCardBody)`
  background-color: ${USE_ROOT_COLOR("soft-color")};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

interface IProps {
  name?: string;
}

export function GuestFooter({ name }: IProps) {
  return (
    <Root>
      <Stack justify="center">
        <Typo.SM as="span">{name || "My Site"} © 2022</Typo.SM>
      </Stack>
    </Root>
  );
}
