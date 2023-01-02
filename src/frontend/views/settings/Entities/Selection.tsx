import {
  FormButton,
  RenderList,
  SectionListItem,
  Spacer,
} from "@hadmean/chromista";
import React, { useEffect, useState } from "react";
import { useStringSelections } from "../../../lib/selection";

interface IProps {
  hiddenList: string[];
  allList: string[];
  onSubmit: (columnsSelection: string[]) => Promise<void>;
  getEntityFieldLabels: (fieldName: string) => string;
}

const LONG_LIST_THRESHOLD = 10;

export function EntitiesSelection({
  getEntityFieldLabels,
  allList,
  onSubmit,
  hiddenList,
}: IProps) {
  const { toggleSelection, currentPageSelection, selectMutiple } =
    useStringSelections();

  const [touched, setTouched] = useState(false);

  const [isMakingRequest, setIsMakingRequest] = useState(false);

  useEffect(() => {
    selectMutiple(hiddenList);
  }, [hiddenList]);

  const formButton = (
    <>
      <Spacer size="xxl" />
      <FormButton
        onClick={async () => {
          setIsMakingRequest(true);
          await onSubmit(currentPageSelection);
          setIsMakingRequest(false);
          setTouched(false);
        }}
        text="Save Changes"
        disabled={!touched}
        isMakingRequest={isMakingRequest}
      />
    </>
  );

  return (
    <>
      {allList.length > LONG_LIST_THRESHOLD && (
        <>
          {formButton}
          <Spacer size="xxl" />
        </>
      )}
      {allList.length > 0 && (
        <>
          <RenderList
            items={allList.map((listItem) => ({ name: listItem }))}
            singular="Entity"
            render={(menuItem) => {
              const isHidden = currentPageSelection.includes(menuItem.name);
              return (
                <SectionListItem
                  label={getEntityFieldLabels(menuItem.name)}
                  key={menuItem.name}
                  toggle={{
                    selected: !isHidden,
                    onChange: () => {
                      setTouched(true);
                      toggleSelection(menuItem.name);
                    },
                  }}
                />
              );
            }}
          />
          {formButton}
        </>
      )}
    </>
  );
}
