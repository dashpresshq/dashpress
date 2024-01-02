import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { DataStateKeys } from "frontend/lib/data/types";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { EmptyWrapper } from "../EmptyWrapper";
import { FormSearch } from "../Form/FormSearch";
import { defaultSearchFunction } from "./utils";
import { ListSkeleton } from "../Skeleton/List";
import { IEmptyWrapperProps } from "../EmptyWrapper/types";

export { ListManagerItem } from "./ListManagerItem";

const SEARCH_THRESHOLD = 10;

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
  margin: -16px;
  border-radius: 0px;
`;

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export interface IProps<T, K extends StringProps<T>> {
  items: DataStateKeys<T[]>;
  listLengthGuess: number;
  labelField: K;
  empty?: IEmptyWrapperProps;
  getLabel?: (name: string) => string;
  render: (item: T & { label: string }, index: number) => ReactNode;
}

export function ListManager<T, K extends StringProps<T>>({
  labelField,
  listLengthGuess,
  getLabel,
  items,
  empty,
  render,
}: IProps<T, K>) {
  const itemsLength = items.data.length;
  const [searchString, setSearchString] = useState("");

  const labelledItems: Array<T & { label: string }> = items.data.map(
    (item) => ({
      ...item,
      label: getLabel
        ? getLabel(item[labelField] as unknown as string)
        : item[labelField],
    })
  ) as Array<T & { label: string }>;

  const searchResults =
    searchString.length > 0
      ? defaultSearchFunction(labelledItems, searchString, labelField)
      : labelledItems;

  return (
    <ViewStateMachine
      error={items.error}
      loading={items.isLoading}
      loader={<ListSkeleton count={listLengthGuess} />}
    >
      {itemsLength === 0 ? (
        <EmptyWrapper {...{ ...empty }} />
      ) : (
        <Root>
          {itemsLength > SEARCH_THRESHOLD ? (
            <FormSearch onChange={setSearchString} />
          ) : null}
          {searchResults.map((item, index) => (
            <div key={item[labelField] as unknown as string}>
              {render(item, index)}
            </div>
          ))}
          {searchResults.length === 0 && searchString.length > 0 ? (
            <EmptyWrapper text="No Search Results" />
          ) : null}
        </Root>
      )}
    </ViewStateMachine>
  );
}
