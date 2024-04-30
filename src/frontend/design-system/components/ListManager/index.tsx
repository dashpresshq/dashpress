import { useEffect, useState } from "react";
import styled from "styled-components";
import { DataStateKeys } from "frontend/lib/data/types";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { arrayMoveImmutable } from "shared/lib/array/move";
import SortableList, { SortableItem } from "react-easy-sort";
import { Z_INDEXES } from "frontend/design-system/constants/zIndex";
import { sortListByOrder } from "shared/lib/array/sort";
import { msg } from "@lingui/macro";
import { EmptyWrapper } from "../EmptyWrapper";
import { FormSearch } from "../Form/FormSearch";
import { defaultSearchFunction, defaultToEmptyArray } from "./utils";
import { ListSkeleton } from "../Skeleton/List";
import { IEmptyWrapperProps } from "../EmptyWrapper/types";
import { IListMangerItemProps, ListManagerItem } from "./ListManagerItem";

const SEARCH_THRESHOLD = 10;

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
  margin: -16px;
  border-radius: 0px;

  .dragged .grab-icon {
    cursor: grabbing;
  }
`;

type StringProps<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export interface IProps<T, K extends StringProps<T>> {
  items: DataStateKeys<T[]>;
  listLengthGuess: number;
  sort?: {
    orderList: string[];
    key: StringProps<T>;
    on: (data: string[]) => void;
  };
  labelField: K;
  empty?: IEmptyWrapperProps;
  getLabel?: (name: string) => string;
  render: (item: T & { label: string }, index: number) => IListMangerItemProps;
}

export function ListManager<T, K extends StringProps<T>>({
  labelField,
  listLengthGuess,
  getLabel,
  items,
  empty,
  sort,
  render,
}: IProps<T, K>) {
  const itemsLength = items.data.length;
  const [searchString, setSearchString] = useState("");

  const [itemsData, setItemsData] = useState<Array<T>>([]);

  const onSortEnd = (oldOrder: number, newOrder: number) => {
    const newOrderItems = arrayMoveImmutable(itemsData, oldOrder, newOrder);
    setItemsData(newOrderItems);
    sort?.on(newOrderItems.map((item) => item[sort.key] as unknown as string));
  };

  useEffect(() => {
    let itemsData$1 = defaultToEmptyArray(items.data);

    if (sort?.orderList) {
      itemsData$1 = sortListByOrder(sort.orderList, itemsData$1, sort.key);
    }

    setItemsData(itemsData$1);
  }, [items.data.length, sort?.orderList.length]);

  const labelledItems: Array<T & { label: string }> = itemsData.map((item) => ({
    ...item,
    label: getLabel
      ? getLabel(item[labelField] as unknown as string)
      : item[labelField],
  })) as Array<T & { label: string }>;

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
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged"
          >
            {searchResults.map((item, index) => (
              <SortableItem key={item[labelField] as unknown as string}>
                <div className="item" style={{ zIndex: Z_INDEXES.dragAndDrop }}>
                  <ListManagerItem
                    {...render(item, index)}
                    sortable={
                      !!sort && searchString.length === 0 && itemsLength > 1
                    }
                  />
                </div>
              </SortableItem>
            ))}
          </SortableList>
          {searchResults.length === 0 && searchString.length > 0 ? (
            <EmptyWrapper text={msg`No Search Results`} />
          ) : null}
        </Root>
      )}
    </ViewStateMachine>
  );
}
