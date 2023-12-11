import React, { ReactNode, useState } from "react";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ErrorAlert } from "../Alert";
import { EmptyWrapper } from "../EmptyWrapper";
import { ListSkeleton } from "../Skeleton/List";
import { SectionList } from "../Section/SectionList";
import { FormSearch } from "../Form/FormSearch";

export interface IProps<T> {
  isLoading?: false | number;
  items: T[];
  singular?: string;
  error?: unknown;
  notSearchable?: boolean;
  sortByLabel?: boolean;
  getLabel?: (name: string) => string;
  render: (item: T & { label: string }, index: number) => ReactNode;
  searchFunction?: (
    items: Array<T & { label: string }>,
    searchString: string
  ) => Array<T & { label: string }>;
}

function defaultSearchFunction<T extends { name: string; label: string }>(
  itemsToSearch: T[],
  searchString: string
): Array<T & { label: string }> {
  return itemsToSearch.filter(
    (value) =>
      value.name.toLowerCase().includes(searchString) ||
      value.label.toLowerCase().includes(searchString)
  );
}

export function RenderList<T extends { name: string }>({
  isLoading,
  items: items$1,
  getLabel,
  error,
  sortByLabel,
  notSearchable,
  singular = "Item",
  render,
  searchFunction,
}: IProps<T>) {
  const itemsLength = items$1.length;
  const [searchString, setSearchString] = useState("");
  if (error) {
    return <ErrorAlert message={error} />;
  }
  if (isLoading) {
    return <ListSkeleton count={isLoading} />;
  }
  if (itemsLength === 0) {
    return (
      <EmptyWrapper text={`No ${singular} Has Been Added Yet`}>
        <Spacer size="sm" />
      </EmptyWrapper>
    );
  }

  const labelledItems = items$1.map((item) => ({
    ...item,
    label: getLabel ? getLabel(item.name) : item.name,
  }));

  const itemsToRender = sortByLabel
    ? [...labelledItems].sort((a, b) => a.label.localeCompare(b.label))
    : labelledItems;

  const searchFnToUse = searchFunction || defaultSearchFunction;

  const searchResults =
    searchString.length > 0
      ? searchFnToUse(itemsToRender, searchString)
      : itemsToRender;

  return (
    <SectionList>
      {itemsLength > 5 && !notSearchable ? (
        <FormSearch onChange={setSearchString} />
      ) : null}
      {searchResults.map((item, index) => (
        <div key={item.name}>{render(item, index)}</div>
      ))}
      {searchResults.length === 0 && searchString.length > 0 ? (
        <EmptyWrapper text="No Search Results" />
      ) : null}
    </SectionList>
  );
}
