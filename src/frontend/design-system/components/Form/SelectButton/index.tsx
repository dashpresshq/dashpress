import styled from "styled-components";
import { sluggify } from "shared/lib/strings";
import { ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { OutlineButton } from "../../Button/Button";
import { IBaseFormSelect } from "../Select/types";
import { LabelAndError } from "../LabelAndError";

// interface IProps {
//   name: string;
//   disabled?: boolean;
//   sm?: boolean;
//   options: ISelectData[];
//   value: string | boolean;
//   onChange: (value: string | boolean) => void;
// }

const Input = styled.input`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

const Root = styled.div`
  position: relative;
  display: inline-flex;
  vertical-align: middle;

  & > button:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  & > button:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }
`;

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
}

export function FormSelectButton(formInput: IFormSelect) {
  const { input, selectData, disabled, sm } = formInput;

  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <Root>
        {selectData.map(({ value, label }, index) => {
          const isChecked =
            input.value === value || (index === 0 && input.value === undefined);

          return (
            <OutlineButton
              type="button"
              role="option"
              size={sm ? "xs" : undefined}
              aria-selected={isChecked}
              disabled={disabled}
              key={`${value}`}
              className={isChecked ? "active" : ""}
              onClick={() => input.onChange(value)}
            >
              <Input
                type="radio"
                name={`${input.name}__${sluggify(
                  // eslint-disable-next-line no-nested-ternary
                  typeof value === "boolean"
                    ? value
                      ? "true"
                      : "false"
                    : value
                )}`}
                readOnly
                checked={isChecked}
              />
              {_(label)}
            </OutlineButton>
          );
        })}
      </Root>
    </LabelAndError>
  );
}
