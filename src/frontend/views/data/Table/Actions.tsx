import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import { useEntityIdField } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";

interface IProps {
  entity: string;
  row: {
    original: Record<string, unknown>;
  };
}

export function TableActions({ row, entity }: IProps) {
  const idField = useEntityIdField(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);
  const idValue = row.original[idField.data || "id"] as string;
  return (
    <Stack spacing={4} align="center">
      {canUserPerformCrudAction("details") && (
        <div>
          <SoftButton
            action={NAVIGATION_LINKS.ENTITY.DETAILS(entity, idValue)}
            label="Details"
            justIcon
            icon="eye"
          />
        </div>
      )}
      {canUserPerformCrudAction("update") && (
        <div>
          <SoftButton
            action={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
            label="Edit"
            icon="edit"
            justIcon
          />
        </div>
      )}
      {canUserPerformCrudAction("delete") && (
        <div>
          <DeleteButton
            onDelete={() => entityDataDeletionMutation.mutate(idValue)}
            isMakingDeleteRequest={
              entityDataDeletionMutation.isLoading &&
              entityDataDeletionMutation.variables === idValue
            }
            shouldConfirmAlert
          />
        </div>
      )}
    </Stack>
  );
}
