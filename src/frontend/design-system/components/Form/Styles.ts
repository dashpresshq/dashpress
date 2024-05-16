import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import styled, { css } from "styled-components";

export interface IInput {
  sm?: true;
}

export const FORM_INPUT_SHADOW_CSS = css`
  border: 1px solid ${USE_ROOT_COLOR("border-color")};
  box-shadow: 0 0 ${USE_ROOT_COLOR("border-color")},
    0 0 ${USE_ROOT_COLOR("border-color")},
    0 1px 2px 0 ${USE_ROOT_COLOR("border-color")};
`;

export const InputStyles = css<IInput>`
  margin: 0;
  overflow: visible;
  display: block;
  width: 100%;
  height: calc(1.8em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.8;
  color: ${USE_ROOT_COLOR("main-text")};
  background-color: ${USE_ROOT_COLOR("base-color")};
  background-clip: padding-box;
  border-radius: 6px;
  ${FORM_INPUT_SHADOW_CSS}

  transition: border-color 0.15s ease-in-out;

  ${(props) =>
    props.sm &&
    css`
      height: calc(1.8em + 0.5rem + 2px);
      padding: 0.25rem 0.5rem;
      font-size: 0.71rem;
      line-height: 1.8;
      border-radius: 4px;
    `}

  &:focus {
    border-width: 1.5px;
    color: ${USE_ROOT_COLOR("main-text")};
    background-color: ${USE_ROOT_COLOR("base-color")};
    border-color: ${USE_ROOT_COLOR("primary-color")};
    outline: 0;
  }

  &[aria-invalid] {
    border-width: 1px;
    border-color: ${SYSTEM_COLORS.danger} !important;
  }

  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 ${USE_ROOT_COLOR("main-text")};
  }

  &:disabled {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Input = styled.input<IInput>`
  ${InputStyles}
`;

export const FormLabel = styled.label<{ sm?: true }>`
  padding-bottom: 1px;
  margin-bottom: 0;
  font-size: 0.8125rem;
  line-height: 1.8;
  text-align: right;
  display: inline-block;
  font-weight: 400;
  ${(props) =>
    props.sm &&
    css`
      font-size: 11px;
    `}
  color: ${USE_ROOT_COLOR("main-text")};
`;

export const FormFeedback = styled.p<{ sm?: true }>`
  color: ${SYSTEM_COLORS.danger};
  font-size: 12px;
  padding-bottom: 0px;
  margin: 0px;
  ${(props) =>
    props.sm &&
    css`
      font-size: 10px;
    `}
`;

export const RequiredAsterick = styled.span`
  color: ${SYSTEM_COLORS.danger};
  font-weight: bolder;
`;
