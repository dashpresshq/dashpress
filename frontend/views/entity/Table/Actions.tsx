import { DeleteButton, SoftButton, Stack } from '@gothicgeeks/design-system';
import { useEntityDataDeletionMutation } from 'frontend/hooks/data/data.store';
import {
  IEntityCrudSettings,
  useEntitySlug,
} from 'frontend/hooks/entity/entity.config';
import { useEntityIdField } from 'frontend/hooks/entity/entity.store';
import { NAVIGATION_LINKS } from 'frontend/lib/routing/links';
import { useDetailsOffCanvasStore } from './hooks/useDetailsOffCanvas.store';

interface IProps {
  crudSettings: IEntityCrudSettings;
  row: {
    original: Record<string, unknown>;
  };
}

export const TableActions: React.FC<IProps> = ({ crudSettings, row }) => {
  const entity = useEntitySlug();
  const idField = useEntityIdField(entity);
  const entityDataDeletionMutation = useEntityDataDeletionMutation(entity);
  const openDetailsCanvas = useDetailsOffCanvasStore((state) => state.open);

  const idValue = row.original[idField.data || 'id'] as string;
  return (
    <Stack spacing={4} align="center">
      {crudSettings.details && (
        <div>
          <SoftButton
            onClick={() => {
              openDetailsCanvas({ id: idValue, entity });
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
            to={NAVIGATION_LINKS.ENTITY.UPDATE(entity, idValue)}
            label="Edit"
            icon="edit"
            color="theme"
            justIcon
            onClick={() => {}}
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
};
