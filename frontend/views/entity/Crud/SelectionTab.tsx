import {
  FormButton,
  Text,
  RenderList,
  SectionListItem,
  Stack,
  Spacer,
  ErrorAlert,
} from "@gothicgeeks/design-system";
import { useEffect, useState } from "react";
import { IEntityField } from "shared/types";
import { useStringSelections } from "../../../lib/selection";

interface IProps {
  entityFields: IEntityField[];
  isLoading: boolean;
  onToggle?: () => void;
  error: unknown;
  hiddenColumns: string[];
  onSubmit: (columnsSelection: string[]) => Promise<void>;
  enabled: boolean;
  getEntityFieldLabels: (fieldName: string) => string;
  description: string;
  labels: [string, string];
}

export function SelectionTab({
  entityFields,
  isLoading,
  labels,
  getEntityFieldLabels,
  enabled,
  description,
  error,
  onToggle,
  onSubmit,
  hiddenColumns,
}: IProps) {
  const { toggleSelection, currentPageSelection, selectMutiple } =
    useStringSelections();

  const [touched, setTouched] = useState(false);

  const [isMakingRequest, setIsMakingRequest] = useState(false);

  useEffect(() => {
    selectMutiple(hiddenColumns);
  }, [hiddenColumns]);

  const enableDisableLabel = enabled ? labels[0] : labels[1];

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <>
      <Stack justify="space-between">
        <div style={{ width: "100%" }}>
          <Text size="5">{description}</Text>
        </div>
        {onToggle && (
          <FormButton
            isMakingRequest={false}
            size="sm"
            isInverse={enabled}
            text={enableDisableLabel}
            onClick={() => onToggle()}
          />
        )}
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
                  toNoWhere
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
              setTouched(false);
            }}
            text="Save Changes"
            disabled={!touched}
            isMakingRequest={isMakingRequest}
          />
        </>
      )}
    </>
  );
}
