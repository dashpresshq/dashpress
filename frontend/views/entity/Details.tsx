import { AppLayout } from "../../_layouts/app";
import {
  ComponentIsLoading,
  ErrorAlert,
  SectionBox,
  SectionCenter,
  Spacer,
  Text,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntityFieldLabels,
  useEntityFieldSelections,
  useEntityId,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "./Configure/constants";
import {
  useEntityReferenceFields,
  useEntityScalarFields,
} from "../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "./utils";
import { OptionTag } from "./OptionTag";
import { ReferenceComponent } from "./Table/ReferenceComponent";

export function EntityDetails() {
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Details,
    EntityActionTypes.Types,
    EntityActionTypes.Labels,
  ]);
  const entity = useEntitySlug();

  return (
    <AppLayout
      titleNeedsContext={true}
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
        >
          <EntityDetailsView id={id} entity={entity} />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const EntityDetailsView = ({
  id,
  entity,
}: {
  id: string;
  entity: string;
}) => {
  const dataDetails = useEntityDataDetails(entity, id);
  const entityScalarFields = useEntityScalarFields(entity);
  const hiddenDetailsColumns = useSelectedEntityColumns(
    "hidden_entity_details_columns",
    entity
  );
  const getEntityFieldLabels = useEntityFieldLabels(entity);
  const entityReferenceFields = useEntityReferenceFields(entity);
  const entityFieldSelections = useEntityFieldSelections(entity);

  const error =
    dataDetails.error ||
    hiddenDetailsColumns.error ||
    entityScalarFields.error ||
    entityReferenceFields.error;

  if (!id) {
    return null;
  }

  return (
    <>
      {dataDetails.isLoading ||
      entityReferenceFields.isLoading ||
      entityScalarFields.isLoading ||
      hiddenDetailsColumns.isLoading ? (
        <ComponentIsLoading />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          {/* TODO use a breadcrumb here for the deep entities */}
          {fitlerOutHiddenScalarColumns(
            entityScalarFields,
            hiddenDetailsColumns
          ).map(({ name }) => {
            const value = dataDetails?.data?.[name];

            let contentToRender = <Text>{value}</Text>;

            if (entityReferenceFields.data?.[name]) {
              contentToRender = (
                <ReferenceComponent
                  entity={entityReferenceFields.data?.[name]}
                  id={value as string}
                />
              );
            } else if (entityFieldSelections[name]) {
              const availableOption = entityFieldSelections[name].find(
                (option) => option.value === value
              );
              if (availableOption) {
                contentToRender = <OptionTag {...availableOption} />;
              }
            }

            return (
              <>
                <Text size="5" weight="bold">
                  {getEntityFieldLabels(name)}
                </Text>
                {contentToRender}
                <Spacer />
              </>
            );
          })}
        </>
      )}
    </>
  );
};
