import { css } from "styled-components";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { FORM_INPUT_SHADOW_CSS } from "../Styles";

export const SelectStyles = css`
  &.invalid {
    .react-select__control {
      border: 1px solid ${SYSTEM_COLORS.danger} !important;
    }
  }

  .react-select__control {
    background: ${USE_ROOT_COLOR("base-color")};
    ${FORM_INPUT_SHADOW_CSS}

    &:hover {
      border: 1px solid ${USE_ROOT_COLOR("primary-color")};
    }
    .react-select__placeholder {
      color: ${USE_ROOT_COLOR("main-text")};
      font-size: 0.8125rem;
    }
    .react-select__single-value {
      color: ${USE_ROOT_COLOR("main-text")};
      font-size: 0.8125rem;
    }
  }

  .react-select__control--is-disabled {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    opacity: 1;
  }

  .react-select__option {
    padding: 4px 8px;
    text-align: left;
    font-size: 14px;
  }

  .react-select__menu {
    background: ${USE_ROOT_COLOR("base-color")};
  }

  .react-select__multi-value__label {
    color: ${USE_ROOT_COLOR("text-on-shade")};
  }

  .react-select__option--is-focused {
    background: ${USE_ROOT_COLOR("primary-shade-color")};
  }

  .react-select__option--is-selected {
    background: ${USE_ROOT_COLOR("primary-color")};
  }

  .react-select__multi-value {
    background: ${USE_ROOT_COLOR("primary-shade-color")};
  }
`;

export const SharedSelectProps = {
  classNamePrefix: "react-select",
};
