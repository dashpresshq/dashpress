import AsyncSelect from "react-select/async";
import styled from "styled-components";
import { useSessionStorage } from "react-use";
import { ILabelValue, ISelectData } from "shared/types/options";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { debounce } from "lodash";
import { useEffect } from "react";
import { SelectStyles, SharedSelectProps } from "../styles";

export const Select = styled(AsyncSelect)`
  ${SelectStyles}
`;

const abortController = new AbortController();

interface IFormMultiSelect {
  url: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const debouncedSearch = debounce(
  async (
    inputValue: string,
    url: string,
    disabledOptions: string[],
    resolve: (value: any) => void
  ) => {
    const toReturn = (
      await ApiRequest.GET(
        `${url}?search=${inputValue}`,
        abortController.signal
      )
    ).filter(
      ({ value }: ISelectData) => !disabledOptions.includes(value as string)
    );
    resolve(toReturn);
  },
  700
);

export function AsyncFormMultiSelect({
  url,
  values = [],
  onChange,
}: IFormMultiSelect) {
  const [cosmeticValues, setCosmeticValues] = useSessionStorage<ILabelValue[]>(
    "cosmetic-multi-select-values",
    values.map((value) => ({ value, label: value }))
  );
  useEffect(() => {
    return () => {
      abortController.abort();
    };
  });
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
