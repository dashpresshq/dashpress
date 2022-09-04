import {
  FormButton,
  RenderList,
  SectionListItem,
  Stack,
  Spacer,
  ListSkeleton,
} from "@hadmean/chromista";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
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
  labels: [string, string];
}

export function SelectionTab({
  entityFields,
  isLoading,
  labels,
  getEntityFieldLabels,
  enabled,
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

  return (
    <ViewStateMachine
      error={error}
      loading={isLoading}
      loader={<ListSkeleton />}
    >
      <Stack justify="space-between" align="flex-start">
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
      {entityFields.length > 0 && (
        <>
          <RenderList
            items={entityFields}
            singular="Field"
            render={(menuItem) => {
              const isHidden = currentPageSelection.includes(menuItem.name);

              return (
                <SectionListItem
                  label={getEntityFieldLabels(menuItem.name)}
                  key={menuItem.name}
                  disabled={!enabled}
                  toggle={
                    enabled
                      ? {
                          selected: !isHidden,
                          onChange: () => {
                            setTouched(true);
                            toggleSelection(menuItem.name);
                          },
                        }
                      : undefined
                  }
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
    </ViewStateMachine>
  );
}
