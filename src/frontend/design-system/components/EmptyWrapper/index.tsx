import React, { ReactNode } from "react";
import styled from "styled-components";
import { Frown as Droplet } from "react-feather";
import { Typo } from "../../primitives";
import { USE_ROOT_COLOR } from "../../theme";

export interface IProps {
  text: string;
  hideIcon?: true;
  children?: ReactNode;
}

const StyledWrapper = styled.div`
  text-align: center;
  padding: 30px;
  padding-bottom: 20px;
  border-radius: 0.25rem;
  background: ${USE_ROOT_COLOR("base-color")};
`;

export function EmptyWrapper({ text, hideIcon, children }: IProps) {
  return (
    <StyledWrapper>
      {hideIcon ? null : (
        <Droplet size={50} color={USE_ROOT_COLOR("muted-text")} />
      )}
      <br />
      <br />
      <Typo.MD color="muted"> {text} </Typo.MD>
      {children}
    </StyledWrapper>
  );
}
