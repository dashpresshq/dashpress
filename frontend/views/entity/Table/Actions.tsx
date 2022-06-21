import { DeleteButton, SoftButton, Stack } from "@gothicgeeks/design-system";
import { useEntityDataDeletionMutation } from "frontend/hooks/data/data.store";
import {
  IEntityCrudSettings,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useEntityIdField } from "frontend/hooks/entity/entity.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";

interface IProps {
  crudSettings: IEntityCrudSettings;
  setShowDetailsOffCanvas: (id: string) => void;
  row: {
    original: Record<string, unknown>;
  };
}

export const TableActions: React.FC<IProps> = ({
  crudSettings,
  setShowDetailsOffCanvas,
  row,
}) => {
  const entity = useEntitySlug();
  const idField = useEntityIdField(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);

  const idValue = row.original[idField.data || "id"] as string;
  return (
    <Stack spacing={4} align="center">
      {crudSettings.details && (
        <div>
          <SoftButton
            onClick={() => {
              setShowDetailsOffCanvas(idValue);
            }}
            label="Details"
            color="primary"
            justIcon={true}
            icon="eye"
          />
        </div>
      )}
      {crudSettings.update && (
        <div>
          <SoftButton
            to={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
            label="Edit"
            icon="edit"
            color="theme"
            justIcon={true}
            onClick={() => {}}
          />
        </div>
      )}
      {crudSettings.delete && (
        <div>
          <DeleteButton
            onDelete={() => entityDataDeletionMutation.mutate(idValue)}
            isMakingDeleteRequest={entityDataDeletionMutation.isLoading}
            shouldConfirmAlert={true}
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
};
