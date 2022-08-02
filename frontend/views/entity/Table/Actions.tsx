import { DeleteButton, SoftButton, Stack } from "@gothicgeeks/design-system";
import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import {
  useEntityDiction,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useEntityIdField } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useNavigationStack } from "frontend/lib/routing/useGoBackContext";
import { IEntityCrudSettings } from "shared/configuration.constants";

interface IProps {
  crudSettings: IEntityCrudSettings;
  row: {
    original: Record<string, unknown>;
  };
}

export function TableActions({ crudSettings, row }: IProps) {
  const entity = useEntitySlug();
  const idField = useEntityIdField(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const entityDiction = useEntityDiction(entity);
  const { pushToStack } = useNavigationStack(entityDiction.plural);

  const idValue = row.original[idField.data || "id"] as string;
  return (
    <Stack spacing={4} align="center">
      {crudSettings.details && (
        <div>
          <SoftButton
            action={NAVIGATION_LINKS.ENTITY.DETAILS(entity, idValue)}
            secondaryAction={() => {
              pushToStack();
            }}
            label="Details"
            color="primary"
            justIcon
            icon="eye"
          />
        </div>
      )}
      {crudSettings.update && (
        <div>
          <SoftButton
            action={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
            secondaryAction={() => {
              pushToStack();
            }}
            label="Edit"
            icon="edit"
            color="theme"
            justIcon
          />
        </div>
      )}
      {crudSettings.delete && (
        <div>
          <DeleteButton
            onDelete={() => entityDataDeletionMutation.mutate(idValue)}
            isMakingDeleteRequest={entityDataDeletionMutation.isLoading}
            shouldConfirmAlert
          />
        </div>
      )}
      {/* <div>
      <SoftButton
        to={`/edit/foo`}
        pushLeft={true}
        label="Details"
        justIcon={true}
        icon="save"
      />
      <Spacer />
    </div> */}
      {/* Clone */}
      {/* // inline -edit // related entities */}
    </Stack>
  );
}
