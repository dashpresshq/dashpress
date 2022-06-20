import {
  FormButton,
  Text,
  RenderList,
  SectionListItem,
  Stack,
  Spacer,
} from "@gothicgeeks/design-system";
import { IEntityField } from "../../../../../backend/entities/types";
import { useStringSelections } from "../../../../lib/selection";
import { useEffect, useState } from "react";

interface IProps {
  entityFields: IEntityField[];
  isLoading: boolean;
  onToggle: () => void;
  hiddenColumns: string[];
  onSubmit: (columnsSelection: string[]) => Promise<void>;
  enabled: boolean;
  getEntityFieldLabels: (fieldName: string) => string;
  description: string;
  labels: [string, string];
}

export const SelectionTab: React.FC<IProps> = ({
  entityFields,
  isLoading,
  labels,
  getEntityFieldLabels,
  enabled,
  description,
  onToggle,
  onSubmit,
  hiddenColumns,
}) => {
  const { toggleSelection, currentPageSelection, selectMutiple } =
    useStringSelections();

  const [touched, setTouched] = useState(false);

  const [isMakingRequest, setIsMakingRequest] = useState(false);

  useEffect(() => {
    selectMutiple(hiddenColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenColumns]);

  const enableDisableLabel = enabled ? labels[0] : labels[1];

  return (
    <>
      <Stack justify="space-between">
        <div style={{ width: "100%" }}>
          <Text size="5">{description}</Text>
        </div>
        <FormButton
          isMakingRequest={false}
          size="sm"
          isInverse={enabled}
          text={enableDisableLabel}
          onClick={() => onToggle()}
        />
      </Stack>
      <Spacer size="xxl" />
      {enabled && entityFields.length > 0 && (
        <>
          <RenderList
            isLoading={isLoading}
            items={entityFields}
            singular="Field"
            render={(menuItem) => {
              const isHidden = currentPageSelection.includes(menuItem.name);

              return (
                <SectionListItem
                  label={getEntityFieldLabels(menuItem.name)}
                  key={menuItem.name}
                  actionButtons={
                    enabled
                      ? [
                          {
                            isInverse: isHidden,
                            text: isHidden ? "Show" : "Hide",
                            onClick: () => {
                              setTouched(true);
                              toggleSelection(menuItem.name);
                            },
                            isMakingRequest: false,
                          },
                        ]
                      : []
                  }
                  toNoWhere={true}
                />
              );
            }}
          />

          <Spacer size="xxl" />
          <FormButton
            onClick={async () => {
              setIsMakingRequest(true);
              await onSubmit(currentPageSelection);
              setIsMakingRequest(false);
            }}
            text={"Save Changes"}
            disabled={!touched}
            isMakingRequest={isMakingRequest}
          />
        </>
      )}
    </>
  );
};
