import React from "react";
import styled, { keyframes } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

interface IProgressBar {
  progress: number;
}

const progressBarStripes = keyframes`
from{background-position:.625rem 0}to{background-position:0 0}
`;

const StyledProgress = styled.div`
  display: flex;
  height: 0.625rem;
  overflow: hidden;
  line-height: 0;
  font-size: 0.60938rem;
  background-color: #eaf0f9;
  border-radius: 1.25rem;
  margin-bottom: 1rem;
`;

const StyledProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: $ ${USE_ROOT_COLOR("text-on-primary")};
  text-align: center;
  white-space: nowrap;
  background-color: ${USE_ROOT_COLOR("primary-color")};
  transition: width 0.6s ease;

  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 0.625rem 0.625rem;

  &:last-child {
    border-radius: 0 100px 100px 0;
  }

  animation: ${progressBarStripes} 1s linear infinite;
`;

export function ProgressBar({ progress }: IProgressBar) {
  return (
    <StyledProgress>
      <StyledProgressBar
        role="progressbar"
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {progress}%
      </StyledProgressBar>
    </StyledProgress>
  );
}
