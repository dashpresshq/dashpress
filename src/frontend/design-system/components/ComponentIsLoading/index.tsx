import * as React from "react";
import styled, { keyframes } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

const DELAY_MS = 500;

const ldsRippleAnimation = keyframes`
0% {
  top: 36px;
  left: 36px;
  width: 0;
  height: 0;
  opacity: 1;
}
100% {
  top: 0px;
  left: 0px;
  width: 72px;
  height: 72px;
  opacity: 0;
}
`;

export const StyledLdsWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`;

const StyledLds = styled.div`
  position: absolute;
  border: 4px solid ${USE_ROOT_COLOR("primary-color")};
  opacity: 1;
  border-radius: 50%;
  animation: ${ldsRippleAnimation} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;

  &:nth-child(2) {
    animation-delay: -0.5s;
  }
`;

export function ComponentIsLoading() {
  return (
    <div style={{ textAlign: "center", margin: "30px", marginBottom: "20px" }}>
      <StyledLdsWrapper>
        <StyledLds />
        <StyledLds />
      </StyledLdsWrapper>
    </div>
  );
}

export function DelayedComponentIsLoading() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => setShow(true), DELAY_MS);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  if (!show) {
    return null;
  }
  return <ComponentIsLoading />;
}
