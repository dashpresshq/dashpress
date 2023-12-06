import React, { useEffect, useState } from "react";
import { ICrudConfig } from "frontend/lib/crud-config";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { RenderList } from "frontend/design-system/components/RenderList";
import { SectionListItem } from "frontend/design-system/components/Section/SectionList";
import { useStringSelections } from "../../../lib/selection";

interface IProps {
  selectionKey: string;
  hiddenList: string[];
  allList: string[];
  crudConfig: ICrudConfig;
  onSubmit: (columnsSelection: string[]) => Promise<void | string[]>;
  getEntityFieldLabels: (fieldName: string) => string;
}

const LONG_LIST_THRESHOLD = 10;

export function EntitiesSelection({
  selectionKey,
  getEntityFieldLabels,
  allList,
  onSubmit,
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

  const formButton = (
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
            items={allList.map((listItem) => ({
              name: listItem,
            }))}
            getLabel={getEntityFieldLabels}
            singular="Entity"
            render={(menuItem) => {
              const isHidden = isSelected(menuItem.name);
              return (
                <SectionListItem
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
      )}
    </>
  );
}
