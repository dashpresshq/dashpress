import {
  RenderList,
  SectionBox,
  SectionCenter,
  SectionListItem,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { AppLayout } from "../../../_layouts/app";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityCrudSettings,
  useEntityDiction,
  useEntityFieldLabels,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { EntityDetailsView } from "./DetailsView";

export function EntityDetails() {
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Details,
    EntityActionTypes.Types,
    EntityActionTypes.Labels,
  ]);
  const entity = useEntitySlug();

  const referenceFields = useEntityReferenceFields(entity);
  const getEntityFieldLabels = useEntityFieldLabels();
  const entityCrudSettings = useEntityCrudSettings();

  return (
    <AppLayout
      titleNeedsContext
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        {
          label: "Details",
          value: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
        },
      ]}
      actionItems={actionItems}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.details(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
          isLoading
          deleteAction={() => console.log("")}
          isMakingDeleteRequest={false}
          iconButtons={[
            { icon: "edit", link: "", label: "Edit" },
            { icon: "save", link: "", label: "Clone" },
          ]}
        >
          <EntityDetailsView displayFrom="details" id={id} entity={entity} />
        </SectionBox>
        <Spacer size="xl" />
        <SectionBox title="Relations">
          <RenderList
            items={(referenceFields.data?.toMany || []).map(
              (relatedEntity) => ({ name: relatedEntity })
            )}
            singular="Relation"
            isLoading={referenceFields.isLoading}
            render={(menuItem) => {
              return (
                <SectionListItem
                  label={getEntityFieldLabels(menuItem.name)}
                  key={menuItem.name}
                  to={NAVIGATION_LINKS.ENTITY.TABLE(menuItem.name)}
                />
              );
            }}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
