import React from "react";
import styled from "styled-components";
import { Frown as Droplet } from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SoftButton } from "../Button/SoftButton";
import { IEmptyWrapperProps } from "./types";

const Root = styled.div`
  text-align: center;
  padding: 30px;
  padding-bottom: 20px;
  border-radius: 0.25rem;
  background: ${USE_ROOT_COLOR("base-color")};
`;

export function EmptyWrapper({ text, createNew }: IEmptyWrapperProps) {
  return (
    <Root>
      <Droplet size={50} color={USE_ROOT_COLOR("muted-text")} />
      <Spacer size="xxl" />
      <Typo.MD color="muted"> {text} </Typo.MD>
      {createNew && (
        <>
          <Spacer size="xxl" />
          <SoftButton
            action={createNew.action}
            icon="add"
            label={createNew.label}
          />
        </>
      )}
    </Root>
  );
}
