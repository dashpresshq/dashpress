import React, { ReactNode } from "react";
import styled from "styled-components";
import { Frown as Droplet } from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Typo } from "frontend/design-system/primitives/Typo";

export interface IProps {
  text: string;
  hideIcon?: true;
  children?: ReactNode;
}

const Root = styled.div`
  text-align: center;
  padding: 30px;
  padding-bottom: 20px;
  border-radius: 0.25rem;
  background: ${USE_ROOT_COLOR("base-color")};
`;

export function EmptyWrapper({ text, hideIcon, children }: IProps) {
  return (
    <Root>
      {hideIcon ? null : (
        <Droplet size={50} color={USE_ROOT_COLOR("muted-text")} />
      )}
      <br />
      <br />
      <Typo.MD color="muted"> {text} </Typo.MD>
      {children}
    </Root>
  );
}
