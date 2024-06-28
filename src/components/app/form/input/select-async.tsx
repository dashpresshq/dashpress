import { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { ISelectData } from "shared/types/options";
import { useApi } from "frontend/lib/data/useApi";
import { useLingui } from "@lingui/react";
import { ErrorAlert } from "@/components/app/alert";
import { IBaseFormSelect } from "@/frontend/design-system/components/Form/Select/types";
import { FormSelect } from "./select";

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

  const fullData = useApi<ISelectData[]>(url, {
    defaultData: [],
  });

  const selectOptions = useApi<ISelectData[]>(
    debounceSearch ? `${url}?search=${debounceSearch}` : url,
    {
      defaultData: [],
    }
  );

  const currentLabelFromSelection = useMemo(() => {
    const isValueInFirstDataLoad = fullData.data.find(
      ({ value }: ISelectData) => value === input.value
    );

    if (isValueInFirstDataLoad) {
      return _(isValueInFirstDataLoad.label);
    }

    const isValueInSelectionOptions = selectOptions.data.find(
      ({ value }: ISelectData) => value === input.value
    );

    if (isValueInSelectionOptions) {
      return _(isValueInSelectionOptions.label);
    }

    return undefined;
  }, [url, fullData.isLoading]);

  const referenceLabel = useApi(referenceUrl?.(input.value), {
    defaultData: "",
    enabled: !!referenceUrl && !!input.value && !currentLabelFromSelection,
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

  if (fullData.data.length >= limit) {
    return (
      <FormSelect
        {...props}
        selectData={selectOptions.data}
        onSearch={{
          isLoading: selectOptions.isLoading,
          onChange: setSearch,
          value: search,
          valueLabel: referenceLabel.data
            ? referenceLabel.data
            : currentLabelFromSelection,
        }}
      />
    );
  }

  return <FormSelect {...props} selectData={fullData.data} />;
}
