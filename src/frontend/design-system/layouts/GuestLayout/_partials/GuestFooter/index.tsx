import React from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "../../../../theme";
import { StyledCardBody } from "../../../../components/Card";
import { Stack, Typo } from "../../../../ui-blocks";

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
