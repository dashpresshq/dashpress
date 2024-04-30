import styled from "styled-components";
import { forwardRef } from "react";
import { USE_ROOT_COLOR } from "../theme/root";

const GrabRoot = styled.svg`
  cursor: grab;
  fill: ${USE_ROOT_COLOR("main-text")};
  touch-action: none;
`;

export const GrabIcon = forwardRef<
  SVGSVGElement,
  {
    width?: number;
    className?: string;
  }
>(({ className, width }, ref) => {
  return (
    <GrabRoot
      ref={ref}
      viewBox="0 0 20 20"
      width={width || 12}
      className={`${className} grab-icon`}
    >
      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
    </GrabRoot>
  );
});
//   // :eyes document.body.style.setProperty("cursor", "grabbing");
