import {
  FormSkeleton,
  FormSkeletonSchema,
  ListSkeleton,
  SectionBox,
  SortList,
  Spacer,
  Tabs,
} from "@hadmean/chromista";
import {
  ENTITY_RELATIONS_ENDPOINT,
  useEntityFields,
  useEntityReferenceFields,
  useEntityRelationsList,
} from "frontend/hooks/entity/entity.store";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import {
  useRouteParam,
  useChangeRouterParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { EntitiesSelection } from "frontend/views/settings/Entities/Selection";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { USER_PERMISSIONS } from "shared/types/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { BaseEntitySettingsLayout } from "../_Base";
import { EntityRelationsForm } from "./Relations.form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import {
  FieldsLabelForm,
  loadingFieldsLabelForm,
} from "../Fields/FieldsLabel.form";

export function EntityRelationsSettings() {
  const entity = useEntitySlug();
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const entityFields = useEntityFields(entity);
  const entityRelationList = useEntityRelationsList(entity);
  const referenceFields = useEntityReferenceFields(entity);

  useSetPageDetails({
    pageTitle: "Relationship Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const entityRelationTemplate = useEntityConfiguration<{
    format: string;
  }>("entity_relation_template", entity);

  const hiddenEntityRelations = useEntityConfiguration<string[]>(
    "hidden_entity_relations",
    entity
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    (entityRelationList.data || []).map((value) => ({ value })),
    "value"
  );

  const entityRelationsLabelsMap = useEntityConfiguration<
    Record<string, string>
  >("entity_relations_labels", entity);

  const upsertEntityRelationTemplateMutation = useUpsertConfigurationMutation(
    "entity_relation_template",
    entity
  );

  const upsertEntityRelationsLabelsMutation = useUpsertConfigurationMutation(
    "entity_relations_labels",
    entity,
    {
      otherEndpoints: [ENTITY_RELATIONS_ENDPOINT(entity)],
    }
  );

  const upsertEntityRelationsOrderMutation = useUpsertConfigurationMutation(
    "entity_relations_order",
    entity,
    {
      otherEndpoints: [ENTITY_RELATIONS_ENDPOINT(entity)],
    }
  );

  const upsertHideEntityRelationMutation = useUpsertConfigurationMutation(
    "hidden_entity_relations",
    entity,
    {
      otherEndpoints: [ENTITY_RELATIONS_ENDPOINT(entity)],
    }
  );

  const error =
    entityRelationTemplate.error ||
    entityFields.error ||
    referenceFields.error ||
    entityRelationList.error ||
    hiddenEntityRelations.error;

  const isLoading =
    entityFields.isLoading ||
    entityRelationList.isLoading ||
    entityRelationTemplate.isLoading ||
    hiddenEntityRelations.isLoading ||
    referenceFields.isLoading ||
    entity === SLUG_LOADING_VALUE;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Relationship Settings"
        iconButtons={[
          {
            action: LINK_TO_DOCS("app-configuration/relations"),
            icon: "help",
            label: "Relationship Settings Documentation",
          },
        ]}
      >
        <Tabs
          currentTab={tabFromUrl}
          onChange={changeTabParam}
          contents={[
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
                >
                  <EntityRelationsForm
                    onSubmit={async (values) => {
                      await upsertEntityRelationTemplateMutation.mutateAsync(
                        values as unknown as Record<string, string>
                      );
                    }}
                    entityFields={(entityFields.data || []).map(
                      ({ name }) => name
                    )}
                    initialValues={entityRelationTemplate.data}
                  />
                </ViewStateMachine>
              ),
              label: "Reference Template",
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={loadingFieldsLabelForm}
                >
                  <Spacer />
                  <FieldsLabelForm
                    initialValues={entityRelationsLabelsMap.data}
                    fields={(referenceFields.data || []).map(
                      ({ table }) => table
                    )}
                    onSubmit={async (data) => {
                      await upsertEntityRelationsLabelsMutation.mutateAsync(
                        data as Record<string, string>
                      );
                    }}
                  />
                </ViewStateMachine>
              ),
              label: "Labels",
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton />}
                >
                  <EntitiesSelection
                    allList={entityRelationList.data || []}
                    getEntityFieldLabels={(relation) =>
                      entityRelationsLabelsMap.data?.[relation] ||
                      getEntitiesDictionPlurals(relation)
                    }
                    hiddenList={hiddenEntityRelations.data || []}
                    onSubmit={async (data) => {
                      await upsertHideEntityRelationMutation.mutateAsync(data);
                    }}
                  />
                </ViewStateMachine>
              ),
              label: "Selection",
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton />}
                >
                  <SortList
                    data={{
                      ...referenceFields,
                      data: (referenceFields.data || []).map(
                        ({ table, label }) => ({
                          value: table,
                          label: label || getEntitiesDictionPlurals(table),
                        })
                      ),
                    }}
                    onSave={
                      upsertEntityRelationsOrderMutation.mutateAsync as (
                        data: string[]
                      ) => Promise<void>
                    }
                  />
                </ViewStateMachine>
              ),
              label: "Order",
            },
          ]}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}
