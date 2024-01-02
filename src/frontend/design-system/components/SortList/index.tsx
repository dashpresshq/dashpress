import React, { useState, useEffect } from "react";
import SortableList, { SortableItem, SortableKnob } from "react-easy-sort";
import styled from "styled-components";
import { DataStateKeys } from "frontend/lib/data/types";
import { Stack } from "frontend/design-system/primitives/Stack";
import { pluralize } from "shared/lib/strings";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { arrayMoveImmutable } from "shared/lib/array/move";
import { GrabIcon } from "shared/constants/Icons";
import { Z_INDEXES } from "frontend/design-system/constants/zIndex";
import { ErrorAlert } from "../Alert";
import { EmptyWrapper } from "../EmptyWrapper";
import { FormButton } from "../Button/FormButton";
import { defaultToEmptyArray } from "./utils";
import { ListSkeleton } from "../Skeleton/List";
import { SHADOW_CSS } from "../Card";

export interface IProps<T> {
  data: DataStateKeys<T[]>;
  onSave: (data: string[]) => Promise<void | string[]>;
}

const SortRoot = styled(Stack)`
  ${SHADOW_CSS}
  margin: 12px 0px;
  padding: 8px;
  user-select: none;
  border-radius: 4px;
  z-index: ${Z_INDEXES.dragAndDrop};
`;

const Root = styled.div`
  padding: 0px 4px;
`;

export function SortList<T extends { value: string; label?: string }>({
  data,
  onSave,
}: IProps<T>) {
  const [isMakingRequest, setIsMakingRequest] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sortedData, setSortedData] = useState<Array<T>>([]);

  useEffect(() => {
    setSortedData(defaultToEmptyArray(data.data));
  }, [JSON.stringify(data.data)]);

  const onSortEnd = (oldOrder: number, newOrder: number) => {
    setTouched(true);
    setSortedData((array) => arrayMoveImmutable(array, oldOrder, newOrder));
  };

  if (data.error) {
    return <ErrorAlert message={data.error} />;
  }

  if (data.isLoading) {
    return <ListSkeleton count={10} />;
  }

  const itemsLength = defaultToEmptyArray(data?.data)?.length;

  if (itemsLength <= 1) {
    return (
      <EmptyWrapper
        text={`Cant sort ${pluralize({
          singular: "item",
          count: itemsLength,
          inclusive: true,
        })}`}
      />
    );
  }

  const saveChanges = (
    <>
      <Spacer />
      <Stack>
        <FormButton
          onClick={async () => {
            setIsMakingRequest(true);
            await onSave(sortedData.map(({ value }) => value));
            setIsMakingRequest(false);
            setTouched(false);
          }}
          text={(isSubmitting) =>
            isSubmitting ? "Saving Order" : "Save Order"
          }
          icon="save"
          disabled={!touched}
          isMakingRequest={isMakingRequest}
        />
      </Stack>
      <Spacer size="sm" />
    </>
  );

  return (
    <Root>
      <SortableList
        onSortEnd={onSortEnd}
        className="list"
        draggedItemClassName="dragged"
      >
        {sortedData.map((item) => (
          <SortableItem key={item.value}>
            <SortRoot align="center" className="item">
              <SortableKnob>
                <GrabIcon />
              </SortableKnob>
              <Typo.SM>{item.label || item.value}</Typo.SM>
            </SortRoot>
          </SortableItem>
        ))}
      </SortableList>
      {saveChanges}
    </Root>
  );
}
