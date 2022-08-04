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
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
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
import { getEntitiesTabsCount } from "./utils";

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

  const relatedEntities = (referenceFields.data || []).map(
    ({ table: referenceTable }) => ({
      name: referenceTable,
    })
  );

  const relatedEntitiesMap = Object.fromEntries(
    (referenceFields.data || []).map((relatedEntity) => [
      relatedEntity.table,
      relatedEntity,
    ])
  );

  const relatedEntitiesCounts = useEntitiesCount(
    relatedEntities
      .filter(({ name }) => relatedEntitiesMap[name].type === "toMany")
      .map(({ name }) => name)
  );

  const { isLoading, error } = referenceFields;

  const viewState = useViewStateMachine(isLoading, error, "details");
  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`${entityDiction.singular} Details`);

  return (
    <AppLayout actionItems={actionItems}>
      <SectionCenter>
        <SectionBox
          title={TitleLang.details(entityDiction.singular)}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
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
                const entityCount = getEntitiesTabsCount(
                  relatedEntitiesMap[menuItem.name].type,
                  relatedEntitiesCounts.data[menuItem.name]
                );
                return (
                  <SectionListItem
                    label={`${getEntityFieldLabels(
                      menuItem.name
                    )} ${entityCount}`}
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
