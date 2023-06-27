import React from "react";
import styled from "styled-components";
import { Typo } from "frontend/design-system/primitives/Typo";
import { StyledCard } from "../Card";

const StyledWrapper = styled.div`
  text-align: center;
  margin: 30px;
  margin-bottom: 20px;
`;

export function SelectAnItem() {
  return (
    <StyledCard>
      <StyledWrapper>
        <img src="/assets/svgs/select.svg" alt="0" width="100px" />
        <br />
        <br />
        <Typo.MD color="muted">I display selected items</Typo.MD>
      </StyledWrapper>
    </StyledCard>
  );
}
