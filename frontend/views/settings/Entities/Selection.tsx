import {
  FormButton,
  Text,
  RenderList,
  SectionListItem,
  Spacer,
} from "@gothicgeeks/design-system";
import React, { useEffect, useState } from "react";
import { useStringSelections } from "../../../lib/selection";

interface IProps {
  isLoading: boolean;
  hiddenList: string[];
  allList: string[];
  onSubmit: (columnsSelection: string[]) => Promise<void>;
  getEntityFieldLabels: (fieldName: string) => string;
  description: string;
}

export function EntitiesSelection({
  isLoading,
  getEntityFieldLabels,
  description,
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
      <Text size="5">
        LINK_TO_DOC
        {description}
      </Text>
      {formButton}
      <Spacer size="xxl" />
      {allList.length > 0 && (
        <>
          <RenderList
            items={allList.map((listItem) => ({ name: listItem }))}
            singular="Entity"
            isLoading={isLoading}
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
