import styled, { keyframes } from "styled-components";

const spinKeyFrame = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`;

export const Spin = styled.span`
  animation: ${spinKeyFrame} 1.5s linear infinite;
`;
