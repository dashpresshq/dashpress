import { useState } from "react";
import { useAsync, useDebounce } from "react-use";
import { ISelectData } from "shared/types/options";
import { useApi } from "frontend/lib/data/useApi";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { ErrorAlert } from "@/components/app/alert";
import { IBaseFormSelect } from "@/frontend/design-system/components/Form/Select/types";
import { FormSelect } from "./select";

interface IProps extends IBaseFormSelect {
  url: string;
  referenceUrl?: (value: string) => string;
  limit?: number;
}

export function AsyncFormSelect(props: IProps) {
  const { input, url, referenceUrl, limit = 50 } = props;

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const fullData = useApi<ISelectData[]>(url, {
    defaultData: [],
  });

  const selectOptions = useApi<ISelectData[]>(
    debounceSearch ? `${url}?search=${debounceSearch}` : url,
    {
      defaultData: [],
    }
  );

  const valueLabelToUse = useAsync(async () => {
    if (!input.value) {
      return undefined;
    }
    const isValueInFirstDataLoad = fullData.data.find(
      ({ value }: ISelectData) => value === input.value
    );

    if (isValueInFirstDataLoad) {
      return isValueInFirstDataLoad.label;
    }

    const isValueInSelectionOptions = selectOptions.data.find(
      ({ value }: ISelectData) => value === input.value
    );

    if (isValueInSelectionOptions) {
      return isValueInSelectionOptions.label;
    }

    if (!referenceUrl) {
      return undefined; // or the value
    }

    return await ApiRequest.GET(referenceUrl(input.value));
  }, [url, fullData.isLoading]);

  useDebounce(
    () => {
      setDebounceSearch(search);
    },
    700,
    [search]
  );

  if (fullData.error || selectOptions.error) {
    return <ErrorAlert message={fullData.error || selectOptions.error} />;
  }

  if (fullData.data.length >= limit) {
    return (
      <FormSelect
        {...props}
        selectData={selectOptions.data}
        onSearch={{
          isLoading: selectOptions.isLoading,
          onChange: setSearch,
          value: search,
          valueLabel: valueLabelToUse.value,
        }}
      />
    );
  }

  return <FormSelect {...props} selectData={fullData.data} />;
}
