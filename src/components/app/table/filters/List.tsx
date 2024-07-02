import { IColumnFilterBag } from "shared/types/data";
import { msg } from "@lingui/macro";
import { useDebounce, useSessionStorage } from "react-use";
import { useState } from "react";
import { IFilterProps } from "./types";
import { MultiFilterValues } from "./_MultiFilterValues";
import { Select } from "@/components/ui/select";
import { ILabelValue } from "@/shared/types/options";
import { useApi } from "@/frontend/lib/data/useApi";
import { sluggify } from "@/shared/lib/strings";
import { transformLabelValueToSelectData } from "@/translations/fake";

export function FilterTableByListSelection({
  column: { filterValue, setFilter },
  bag: url,
}: IFilterProps<IColumnFilterBag<string[]>, string>) {
  const values = filterValue?.value || [];

  const [cosmeticValues, setCosmeticValues] = useSessionStorage<ILabelValue[]>(
    `cosmetic-multi-select-values-${sluggify(url)}`,
    []
  );

  const [search, setSearch] = useState("");

  const [debounceSearch, setDebounceSearch] = useState("");

  const selectOptions = useApi<ILabelValue[]>(
    debounceSearch ? `${url}?search=${debounceSearch}` : url,
    {
      defaultData: [],
    }
  );

  const appendCosmeticValues = (value: string) => {
    setCosmeticValues([
      ...cosmeticValues,
      {
        value,
        label:
          selectOptions.data.find(
            (option) => String(option.value) === String(value)
          )?.label || value,
      },
    ]);
  };

  useDebounce(
    () => {
      setDebounceSearch(search);
    },
    700,
    [search]
  );

  return (
    <div>
      <MultiFilterValues
        filterValue={filterValue}
        setFilter={setFilter}
        values={values}
        options={cosmeticValues}
      />
      <Select
        onChange={(value) => {
          appendCosmeticValues(value);
          setFilter({
            ...filterValue,
            value: [...new Set([...values, value])],
          });
        }}
        name="select-filter"
        value=""
        options={transformLabelValueToSelectData(selectOptions.data)}
        onSearch={{
          isLoading: selectOptions.isLoading,
          onChange: setSearch,
          value: search,
        }}
        disabledOptions={values}
        placeholder={msg`Select Option`}
      />
    </div>
  );
}
