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
  useEntityId,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../hooks/entity/entity.config";
import { useEntityDataDetails } from "../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "./Configure/constants";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";
import { fitlerOutHiddenScalarColumns } from "./utils";

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
  const getEntityFieldLabels = useEntityFieldLabels();

  const error =
    dataDetails.error || hiddenDetailsColumns.error || entityScalarFields.error;

  if (!id) {
    return null;
  }

  return (
    <>
      {dataDetails.isLoading ||
      entityScalarFields.isLoading ||
      hiddenDetailsColumns.isLoading ? (
        <ComponentIsLoading />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : (
        <>
          {fitlerOutHiddenScalarColumns(
            entityScalarFields,
            hiddenDetailsColumns
          ).map(({ name }) => (
            <>
              <Text size="5" weight="bold">
                {getEntityFieldLabels(name)}
              </Text>
              <Text>{dataDetails?.data?.[name]}</Text>
              <Spacer />
            </>
          ))}
        </>
      )}
    </>
  );
};
