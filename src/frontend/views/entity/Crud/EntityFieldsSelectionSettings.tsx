import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEffect, useState } from "react";
import { IEntityField } from "shared/types/db";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { RenderList } from "frontend/design-system/components/RenderList";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SectionListItem } from "frontend/design-system/components/Section/SectionList";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useStringSelections } from "frontend/lib/selection";

interface IProps {
  label: string;
  columns?: {
    fields: IEntityField[];
    submit?: (columnsSelection: string[]) => Promise<string[]>;
    hidden: string[];
    getEntityFieldLabels?: (fieldName: string) => string;
  };
  toggling: {
    onToggle?: () => void;
    enabled: boolean;
    label: string;
  };
  isLoading: boolean;
  error: unknown;
}

export function EntityFieldsSelectionSettings({
  columns,
  isLoading,
  toggling,
  error,
  label,
}: IProps) {
  const { toggleSelection, allSelections, selectMutiple, isSelected } =
    useStringSelections(`${label}CrudEntityFieldsSelectionSettings}`);

  const [touched, setTouched] = useState(false);

  const [isMakingRequest, setIsMakingRequest] = useState(false);

  useEffect(() => {
    selectMutiple(columns?.hidden || []);
  }, [columns?.hidden]);

  return (
    <ViewStateMachine
      error={error}
      loading={isLoading}
      loader={<ListSkeleton count={10} />}
    >
      <Stack justify="space-between" align="flex-start">
        {toggling && toggling.onToggle && (
          <FormButton
            isMakingRequest={false}
            icon={toggling?.enabled ? "check" : "square"}
            size="sm"
            isInverse
            text={() => `Enable ${toggling?.label} Functionality`}
            onClick={() => toggling.onToggle()}
          />
        )}
      </Stack>
      <Spacer size="xxl" />
      {columns && (
        <>
          <RenderList
            items={columns.fields}
            singular="Field"
            getLabel={columns.getEntityFieldLabels}
            render={(menuItem) => {
              const isHidden = isSelected(menuItem.name);

              const disabled = menuItem.isId || !toggling.enabled;

              return (
                <SectionListItem
                  label={menuItem.label}
                  key={menuItem.name}
                  disabled={disabled}
                  subtle={disabled}
                  toggle={
                    disabled
                      ? undefined
                      : {
                          selected: !isHidden,
                          onChange: () => {
                            setTouched(true);
                            toggleSelection(menuItem.name);
                          },
                        }
                  }
                />
              );
            }}
          />

          <Spacer size="xxl" />
          <FormButton
            onClick={async () => {
              setIsMakingRequest(true);
              await columns.submit(allSelections);
              setIsMakingRequest(false);
              setTouched(false);
            }}
            text={(isSubmitting) =>
              isSubmitting
                ? `Saving ${label} Selections`
                : `Save ${label} Selections`
            }
            icon="save"
            disabled={!touched}
            isMakingRequest={isMakingRequest}
          />
        </>
      )}
    </ViewStateMachine>
  );
}
