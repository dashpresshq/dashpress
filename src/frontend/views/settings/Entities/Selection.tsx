import { msg } from "@lingui/macro";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { useEffect } from "react";

import { ListManager } from "@/components/app/list-manager";
import type { IListMangerItemProps } from "@/components/app/list-manager/list-manager-item";

import { useStringSelections } from "../../../lib/selection";

interface IProps {
  selectionKey: string;
  hiddenList: string[];
  type: "relations" | "active";
  allList: string[];
  sort?: {
    order: string[];
    save: (columnsSelection: string[]) => Promise<void | string[]>;
  };
  onSubmit: (columnsSelection: string[]) => Promise<void | string[]>;
  getEntityFieldLabels: (fieldName: string) => string;
}

export function EntitiesSelection({
  selectionKey,
  getEntityFieldLabels,
  allList,
  onSubmit,
  sort,
  type,
  hiddenList,
}: IProps) {
  const { toggleSelection, setMultiple, isSelected } = useStringSelections(
    `${selectionKey}--entities-selection`
  );

  useEffect(() => {
    setMultiple(hiddenList);
  }, [hiddenList]);

  return (
    <ListManager
      items={loadedDataState(
        allList.map((listItem) => ({
          name: listItem,
        }))
      )}
      listLengthGuess={15}
      labelField="name"
      getLabel={getEntityFieldLabels}
      empty={{
        text:
          type === "relations"
            ? msg`This entity has no relations`
            : msg`Add new tables through your preferred database editor then restart this application.`,
      }}
      sort={
        sort
          ? {
              orderList: sort.order,
              key: "name",
              on: (newOrder) => {
                sort.save(newOrder);
              },
            }
          : undefined
      }
      render={(menuItem) => {
        const isHidden = isSelected(menuItem.name);
        const props: IListMangerItemProps = {
          label: menuItem.label,
          toggle: {
            selected: !isHidden,
            onChange: () => {
              toggleSelection(menuItem.name, onSubmit);
            },
          },
        };

        return props;
      }}
    />
  );
}
