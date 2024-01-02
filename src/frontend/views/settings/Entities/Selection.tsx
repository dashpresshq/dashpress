import React, { useEffect, useState } from "react";
import { ICrudConfig } from "frontend/lib/crud-config";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import {
  ListManager,
  ListManagerItem,
} from "frontend/design-system/components/ListManager";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { useStringSelections } from "../../../lib/selection";

interface IProps {
  selectionKey: string;
  hiddenList: string[];
  type: "relations" | "active";
  allList: string[];
  crudConfig: ICrudConfig;
  onSubmit: (columnsSelection: string[]) => Promise<void | string[]>;
  getEntityFieldLabels: (fieldName: string) => string;
}

export function EntitiesSelection({
  selectionKey,
  getEntityFieldLabels,
  allList,
  onSubmit,
  type,
  hiddenList,
  crudConfig,
}: IProps) {
  const { toggleSelection, allSelections, setMultiple, isSelected } =
    useStringSelections(`${selectionKey}--entities-selection`);

  const [touched, setTouched] = useState(false);

  const [isMakingRequest, setIsMakingRequest] = useState(false);

  useEffect(() => {
    setMultiple(hiddenList);
  }, [hiddenList]);

  const formButton =
    allList.length > 0 ? (
      <>
        <Spacer size="xxl" />
        <FormButton
          onClick={async () => {
            setIsMakingRequest(true);
            await onSubmit(allSelections);
            setIsMakingRequest(false);
            setTouched(false);
          }}
          icon="save"
          text={crudConfig.FORM_LANG.UPSERT}
          disabled={!touched}
          isMakingRequest={isMakingRequest}
        />
      </>
    ) : null;

  return (
    <>
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
              ? "This entity has no relations"
              : "This application has no active entities. Kindly add new entities through your preferred database editor then restart this application to proceed.",
        }}
        render={(menuItem) => {
          const isHidden = isSelected(menuItem.name);
          return (
            <ListManagerItem
              label={menuItem.label}
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
  );
}
