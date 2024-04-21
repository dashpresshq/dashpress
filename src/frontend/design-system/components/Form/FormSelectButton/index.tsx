import styled from "styled-components";
import { sluggify } from "shared/lib/strings";
import { ISelectData } from "shared/types/options";
import { OutlineButton } from "../../Button/Button";
import { IBaseFormSelect } from "../FormSelect/types";
import { generateFormArias, wrapLabelAndError } from "../_wrapForm";

interface IProps {
  name: string;
  disabled?: boolean;
  sm?: boolean;
  options: ISelectData[];
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}

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

function BaseFormSelectButton({
  options,
  name,
  value: selectedValue,
  onChange,
  sm,
  disabled,
}: IProps) {
  return (
    <Root>
      {options.map(({ value, label }, index) => {
        const isChecked =
          selectedValue === value ||
          (index === 0 && selectedValue === undefined);

        return (
          <OutlineButton
            type="button"
            role="option"
            size={sm ? "xs" : undefined}
            aria-selected={isChecked}
            disabled={disabled}
            key={`${value}`}
            className={isChecked ? "active" : ""}
            onClick={() => onChange(value)}
          >
            <Input
              type="radio"
              name={`${name}__${sluggify(
                // eslint-disable-next-line no-nested-ternary
                typeof value === "boolean" ? (value ? "true" : "false") : value
              )}`}
              readOnly
              checked={isChecked}
            />
            {label}
          </OutlineButton>
        );
      })}
    </Root>
  );
}

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
}

export function FormSelectButton(props: IFormSelect) {
  const { input, selectData, meta, disabled, sm } = props;

  return wrapLabelAndError(
    <BaseFormSelectButton
      {...input}
      {...generateFormArias(meta)}
      name={input.name}
      disabled={disabled}
      sm={sm}
      options={selectData}
    />,
    props
  );
}
