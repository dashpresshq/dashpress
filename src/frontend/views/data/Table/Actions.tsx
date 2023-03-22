import { DeleteButton, SoftButton, Stack } from "@hadmean/chromista";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import { useEntityIdField } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { IEntityCrudSettings } from "shared/configurations";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";

interface IProps {
  crudSettings: IEntityCrudSettings;
  entity: string;
  row: {
    original: Record<string, unknown>;
  };
}

export function TableActions({ crudSettings, row, entity }: IProps) {
  const idField = useEntityIdField(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const userHasPermission = useUserHasPermission();
  const idValue = row.original[idField.data || "id"] as string;
  return (
    <Stack spacing={4} align="center">
      {crudSettings.details && (
        <div>
          <SoftButton
            action={NAVIGATION_LINKS.ENTITY.DETAILS(entity, idValue)}
            label="Details"
            justIcon
            icon="eye"
          />
        </div>
      )}
      {crudSettings.update &&
        userHasPermission(
          META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
            entity,
            GranularEntityPermissions.Update
          )
        ) && (
          <div>
            <SoftButton
              action={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
              label="Edit"
              icon="edit"
              justIcon
            />
          </div>
        )}
      {crudSettings.delete &&
        userHasPermission(
          META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
            entity,
            GranularEntityPermissions.Delete
          )
        ) && (
          <div>
            <DeleteButton
              onDelete={() => entityDataDeletionMutation.mutate(idValue)}
              isMakingDeleteRequest={entityDataDeletionMutation.isLoading}
              shouldConfirmAlert
            />
          </div>
        )}
    </Stack>
  );
}
