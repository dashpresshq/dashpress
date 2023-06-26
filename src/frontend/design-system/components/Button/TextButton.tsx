import styled from "styled-components";
import { USE_ROOT_COLOR } from "../../theme";

export const PlainButton = styled.button`
  &:focus {
    outline: 0;
  }
  background: inherit;
  border: 0;
  cursor: pointer;
  padding: 0;
`;

export const TextButton = styled(PlainButton)`
  display: inline-block;
  position: relative;
  color: ${USE_ROOT_COLOR("primary-color")};

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: ${USE_ROOT_COLOR("primary-color")};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`;
