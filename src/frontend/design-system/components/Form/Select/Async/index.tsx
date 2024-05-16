import { useState } from "react";
import debounce from "lodash/debounce";
import AsyncSelect from "react-select/async";
import styled from "styled-components";
import { useAsync, useSessionStorage } from "react-use";
import { ILabelValue, ISelectData } from "shared/types/options";
import { useApi } from "frontend/lib/data/useApi";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useLingui } from "@lingui/react";
import { FormSelect } from "..";
import {
  LabelAndError,
  generateClassNames,
  generateFormArias,
} from "../../LabelAndError";
import { ErrorAlert } from "../../../Alert";
import { IBaseFormSelect } from "../types";
import { SelectStyles, SharedSelectProps } from "../styles";

interface IProps extends IBaseFormSelect {
  url: string;
  referenceUrl?: (value: string) => string;
  limit?: number;
}

export const Select = styled(AsyncSelect)`
  ${SelectStyles}
`;

const debouncedSearch = debounce(
  async (
    inputValue: string,
    url: string,
    disabledOptions: string[],
    resolve: (value: any) => void
  ) => {
    const toReturn = (
      await ApiRequest.GET(`${url}?search=${inputValue}`)
    ).filter(
      ({ value }: ISelectData) => !disabledOptions.includes(value as string)
    );
    resolve(toReturn);
  },
  700
);

export function AsyncFormSelect(props: IProps) {
  const {
    input,
    url,
    referenceUrl,
    limit = 50,
    meta,
    disabled,
    label: formLabel,
    disabledOptions = [],
    nullable,
    placeholder,
    defaultLabel,
  } = props;

  const [valueLabel, setValueLabel] = useState("");

  const { _ } = useLingui();

  const { isLoading, error, data } = useApi<ISelectData[]>(url, {
    defaultData: [],
  });

  const valueLabelToUse = useAsync(async () => {
    if (valueLabel) {
      return valueLabel;
    }

    if (isLoading) {
      return "Loading Options...";
    }

    if (!input.value) {
      return defaultLabel || `--- Select ${_(formLabel)} ---`;
    }

    const isValueInFirstDataLoad = data.find(
      ({ value }: ISelectData) => value === input.value
    );

    if (isValueInFirstDataLoad) {
      return isValueInFirstDataLoad?.label;
    }
    if (!referenceUrl) {
      return input.value;
    }
    return await ApiRequest.GET(referenceUrl(input.value));
  }, [url, valueLabel, isLoading]);

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (data.length >= limit) {
    return (
      <LabelAndError formInput={props}>
        <Select
          cacheOptions
          defaultOptions
          {...input}
          {...generateFormArias(meta)}
          onChange={({ value, label }: any) => {
            input.onChange(nullable && !value ? null : value);
            setValueLabel(label);
          }}
          id={input.name}
          classNamePrefix={SharedSelectProps.classNamePrefix}
          isDisabled={disabled}
          isLoading={isLoading}
          placeholder={placeholder ? _(placeholder) : null}
          className={generateClassNames(meta)}
          value={{ value: input.value, label: valueLabelToUse.value }}
          loadOptions={(inputValue) =>
            new Promise((resolve) => {
              debouncedSearch(inputValue, url, disabledOptions, resolve);
            }) as unknown as void
          }
        />
      </LabelAndError>
    );
  }

  return <FormSelect {...props} selectData={data} />;
}

interface IFormMultiSelect {
  url: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function AsyncFormMultiSelect({
  url,
  values = [],
  onChange,
}: IFormMultiSelect) {
  const [cosmeticValues, setCosmeticValues] = useSessionStorage<ILabelValue[]>(
    "cosmetic-multi-select-values",
    values.map((value) => ({ value, label: value }))
  );
  return (
    <Select
      cacheOptions
      defaultOptions
      classNamePrefix={SharedSelectProps.classNamePrefix}
      closeMenuOnSelect={false}
      defaultValue={values}
      isMulti
      value={cosmeticValues}
      onChange={(newValues: unknown) => {
        setCosmeticValues(newValues as ILabelValue[]);
        onChange(
          (newValues as ILabelValue[]).map(({ value }) => value as string)
        );
      }}
      loadOptions={(inputValue) =>
        new Promise((resolve) => {
          debouncedSearch(inputValue, url, [], resolve);
        }) as unknown as void
      }
    />
  );
}
