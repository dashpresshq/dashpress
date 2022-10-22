import { SectionBox, SectionCenter } from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types/user";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../../hooks/entity/entity.config";
import { useEntityDataCreationMutation } from "../../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();

  const entityDataCreationMutation = useEntityDataCreationMutation(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Create,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: `Create ${entityDiction.plural}`,
    viewKey: "CREATE_ENTITY",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <SectionCenter>
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={backLink}
        >
          <BaseEntityForm
            action="create"
            onSubmit={entityDataCreationMutation.mutateAsync}
            hiddenColumns={hiddenCreateColumns}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
