import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEffect } from "react";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { ListManager } from "frontend/design-system/components/ListManager";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useStringSelections } from "frontend/lib/selection";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import {
  useEntityFieldLabels,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { CrudViewsKeys } from "shared/configurations";
import { useIsEntityFieldMutatable } from "frontend/views/data/hooks/useIsEntityFieldMutatable";
import { IListMangerItemProps } from "frontend/design-system/components/ListManager/ListManagerItem";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import {
  CRUD_HIDDEN_KEY_CONFIG,
  ORDER_FIELD_CONFIG,
} from "shared/configurations/permissions";
import {
  ENTITY_LIST_PATH,
  ENTITY_TABLE_PATH,
} from "frontend/hooks/data/constants";
import { DataCrudKeys } from "shared/types/data";
import { ENTITY_CRUD_LABELS } from "../constants";
import { makeEntityFieldsSelectionKey } from "./constants";

interface IProps {
  toggling: {
    onToggle?: () => void;
    enabled: boolean;
  };
  isLoading: boolean;
  error: unknown;
  crudKey: DataCrudKeys;
}

export function ToggleCrudState({
  crudKey,
  toggling,
}: {
  crudKey: CrudViewsKeys;
  toggling: {
    onToggle?: () => void;
    enabled: boolean;
  };
}) {
  return (
    <Stack justify="space-between" align="flex-start">
      {toggling && toggling.onToggle && (
        <FormButton
          isMakingRequest={false}
          icon={toggling.enabled ? "check" : "square"}
          size="sm"
          isInverse
          text={() => `Enable ${ENTITY_CRUD_LABELS[crudKey]} Functionality`}
          onClick={() => toggling.onToggle()}
        />
      )}
    </Stack>
  );
}

export function EntityFieldsSelectionSettings({
  isLoading,
  toggling,
  error,
  crudKey,
}: IProps) {
  const entity = useEntitySlug();

  const entityFields = useEntityFields(entity);

  const getEntityFieldLabels = useEntityFieldLabels(entity);

  const isEntityFieldMutatable = useIsEntityFieldMutatable(crudKey);

  const otherEndpoints = [ENTITY_TABLE_PATH(entity), ENTITY_LIST_PATH(entity)];

  const entityHiddenList = useEntityConfiguration(
    CRUD_HIDDEN_KEY_CONFIG[crudKey],
    entity
  );

  const entityOrderList = useEntityConfiguration(
    ORDER_FIELD_CONFIG[crudKey],
    entity
  );

  const upsertHiddenColumnsMutation = useUpsertConfigurationMutation(
    CRUD_HIDDEN_KEY_CONFIG[crudKey],
    entity,
    {
      otherEndpoints,
    }
  );

  const upsertColumnsOrderMutation = useUpsertConfigurationMutation(
    ORDER_FIELD_CONFIG[crudKey],
    entity,
    {
      otherEndpoints,
    }
  );

  const { toggleSelection, selectMutiple, isSelected } = useStringSelections(
    makeEntityFieldsSelectionKey(entity, crudKey)
  );

  useEffect(() => {
    selectMutiple(entityHiddenList.data || []);
  }, [entityHiddenList.data]);

  return (
    <ViewStateMachine
      error={error || entityHiddenList.error || entityOrderList.error}
      loading={
        isLoading || entityOrderList.isLoading || entityHiddenList.isLoading
      }
      loader={<ListSkeleton count={10} />}
    >
      <ToggleCrudState crudKey={crudKey} toggling={toggling} />
      <Spacer size="xxl" />
      <ListManager
        items={entityFields}
        listLengthGuess={10}
        labelField="name"
        empty={{
          text: "This entity has no fields. Kindly add fields from your prefer database tool to manage them here",
        }}
        getLabel={getEntityFieldLabels}
        sort={{
          orderList: entityOrderList.data,
          key: "name",
          on: upsertColumnsOrderMutation.mutate,
        }}
        render={(menuItem) => {
          const isHidden = isSelected(menuItem.name);

          const disabled =
            !isEntityFieldMutatable(menuItem) || !toggling.enabled;

          const props: IListMangerItemProps = {
            label: menuItem.label,
            disabled,
            subtle: disabled,
            toggle: disabled
              ? undefined
              : {
                  selected: !isHidden,
                  onChange: () => {
                    toggleSelection(
                      menuItem.name,
                      upsertHiddenColumnsMutation.mutate
                    );
                  },
                },
          };

          return props;
        }}
      />
    </ViewStateMachine>
  );
}
