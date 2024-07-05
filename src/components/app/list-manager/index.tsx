import { useEffect, useState } from "react";
import type { DataStateKeys } from "frontend/lib/data/types";
import { arrayMoveImmutable } from "shared/lib/array/move";
import SortableList, { SortableItem } from "react-easy-sort";
import { sortListByOrder } from "shared/lib/array/sort";
import { msg } from "@lingui/macro";
import { defaultSearchFunction, defaultToEmptyArray } from "./utils";
import type { IListMangerItemProps } from "./list-manager-item";
import { ListManagerItem } from "./list-manager-item";
import type { IEmptyWrapperProps } from "../empty-wrapper/types";
import { ViewStateMachine } from "../view-state-machine";
import { ListSkeleton } from "../skeleton/list";
import { EmptyWrapper } from "../empty-wrapper";
import { FormSearch } from "../form/input/search";

const SEARCH_THRESHOLD = 10;

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
        <ul className="-mx-4 -mb-4 flex flex-col rounded-none pl-0">
          {itemsLength > SEARCH_THRESHOLD ? (
            <FormSearch onChange={setSearchString} />
          ) : null}
          <SortableList
            onSortEnd={onSortEnd}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className="list"
            draggedItemClassName="[&_.grab-icon]:cursor-grabbing"
          >
            {searchResults.map((item, index) => (
              <SortableItem key={item[labelField] as unknown as string}>
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                <div className="item z-[1000]">
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
        </ul>
      )}
    </ViewStateMachine>
  );
}
