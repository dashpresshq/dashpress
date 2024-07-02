import { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { ILabelValue } from "shared/types/options";
import { useApi } from "frontend/lib/data/useApi";
import { useLingui } from "@lingui/react";
import { ErrorAlert } from "@/components/app/alert";
import { FormSelect } from "./select";
import { IBaseFormSelect } from "./types";
import { transformLabelValueToSelectData } from "@/translations/fake";

interface IProps extends IBaseFormSelect {
  url: string;
  referenceUrl?: (value: string) => string;
  limit?: number;
}

export function AsyncFormSelect(props: IProps) {
  const { _ } = useLingui();

  const { input, url, referenceUrl, limit = 50 } = props;

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const fullData = useApi<ILabelValue[]>(url, {
    defaultData: [],
  });

  const selectOptions = useApi<ILabelValue[]>(
    debounceSearch ? `${url}?search=${debounceSearch}` : url,
    {
      defaultData: [],
    }
  );

  const currentLabelFromSelection = useMemo(() => {
    const isValueInFirstDataLoad = fullData.data.find(
      ({ value }: ILabelValue) => String(value) === String(input.value)
    );

    if (isValueInFirstDataLoad) {
      return _(isValueInFirstDataLoad.label);
    }

    const isValueInSelectionOptions = selectOptions.data.find(
      ({ value }: ILabelValue) => String(value) === String(input.value)
    );

    if (isValueInSelectionOptions) {
      return _(isValueInSelectionOptions.label);
    }

    return undefined;
  }, [url, fullData, selectOptions, input.value]);

  const referenceLabel = useApi(referenceUrl?.(input.value), {
    defaultData: "",
    enabled:
      !!referenceUrl &&
      !!input.value &&
      !(currentLabelFromSelection || fullData.isLoading),
  });

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

  const isLoading = selectOptions.isLoading || fullData.isLoading;

  if (fullData.data.length >= limit) {
    return (
      <FormSelect
        {...props}
        selectData={transformLabelValueToSelectData(selectOptions.data)}
        isLoading={isLoading}
        onSearch={{
          isLoading: selectOptions.isLoading,
          onChange: setSearch,
          value: search,
          valueLabel: currentLabelFromSelection || referenceLabel.data,
        }}
      />
    );
  }

  return (
    <FormSelect
      {...props}
      selectData={transformLabelValueToSelectData(fullData.data)}
      isLoading={isLoading}
    />
  );
}
