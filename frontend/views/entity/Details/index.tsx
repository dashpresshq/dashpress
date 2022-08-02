import {
  ErrorAlert,
  RenderList,
  SectionBox,
  SectionCenter,
  SectionListItem,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useEntityReferenceFields } from "frontend/hooks/entity/entity.store";
import { useEntitiesCount } from "frontend/hooks/data/data.store";
import { AppLayout } from "../../../_layouts/app";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  // useEntityCrudSettings,
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
import { useViewStateMachine } from "../useViewStateMachine";

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
  // const entityCrudSettings = useEntityCrudSettings();

  const relatedEntities = (referenceFields.data?.toMany || []).map(
    (relatedEntity) => ({ name: relatedEntity })
  );

  const relatedEntitiesCounts = useEntitiesCount(
    relatedEntities.map(({ name }) => name)
  );

  const { isLoading, error } = referenceFields;

  const viewState = useViewStateMachine(isLoading, error, "details");

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
            action: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: `${entityDiction.plural}dsd`,
          }}
          deleteAction={() => console.log("")}
          isMakingDeleteRequest={false}
          iconButtons={[
            { icon: "edit", action: "", label: "Edit" },
            { icon: "save", action: "", label: "Clone" },
          ]}
        >
          <EntityDetailsView displayFrom="details" id={id} entity={entity} />
        </SectionBox>
        <Spacer size="xl" />
        <SectionBox title="Relations">
          {viewState.type === "error" && (
            <ErrorAlert message={viewState.message} />
          )}
          {(viewState.type === "render" || viewState.type === "loading") && (
            <RenderList
              items={relatedEntities}
              singular="Relation"
              isLoading={viewState.type === "loading"}
              render={(menuItem) => {
                const count = relatedEntitiesCounts.data[menuItem.name]
                  ?.isLoading
                  ? "Loading..."
                  : relatedEntitiesCounts.data[menuItem.name]?.data?.count;
                return (
                  <SectionListItem
                    label={`${getEntityFieldLabels(menuItem.name)} (${count})`}
                    key={menuItem.name}
                    to={NAVIGATION_LINKS.ENTITY.TABLE(menuItem.name)}
                  />
                );
              }}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

// TODO

// How to get relation count

// How many views a deal item has

// So we need to send a request

// count /dealViews/:dealItemId/dealItem

// SELECT * FROM dealviews where dealItemId = :dealItemId
