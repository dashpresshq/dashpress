import {
  ENTITY_RELATIONS_ENDPOINT,
  useEntityFields,
  useEntityReferenceFields,
  useEntityRelationsList,
} from "frontend/hooks/entity/entity.store";
import { EntitiesSelection } from "frontend/views/settings/Entities/Selection";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { RelationsSettingsDocumentation } from "frontend/docs/relations";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { Tabs } from "frontend/design-system/components/Tabs";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { SortList } from "frontend/design-system/components/SortList";
import {
  FieldsLabelForm,
  loadingFieldsLabelForm,
} from "../Fields/FieldsLabel.form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityRelationsForm } from "./Relations.form";
import { BaseEntitySettingsLayout } from "../_Base";

const DOCS_TITLE = "Relationship Settings";

export function EntityRelationsSettings() {
  const entity = useEntitySlug();
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const entityFields = useEntityFields(entity);
  const entityRelationList = useEntityRelationsList(entity);
  const referenceFields = useEntityReferenceFields(entity);
  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: "Relationship Settings",
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const entityRelationTemplate = useEntityConfiguration(
    "entity_relation_template",
    entity
  );

  const hiddenEntityRelations = useEntityConfiguration(
    "hidden_entity_relations",
    entity
  );

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entityRelationList.data.map((value) => ({ value })),
    "value"
  );

  const entityRelationsLabelsMap = useEntityConfiguration(
    "entity_relations_labels",
    entity
  );

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
    referenceFields.isLoading;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title="Relationship Settings"
        actionButtons={[
          {
            _type: "normal",
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
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
                    onSubmit={upsertEntityRelationTemplateMutation.mutateAsync}
                    entityFields={entityFields.data.map(({ name }) => name)}
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
                  loader={<ListSkeleton count={5} />}
                >
                  <EntitiesSelection
                    type="relations"
                    selectionKey={`${entity}-relations`}
                    allList={entityRelationList.data}
                    getEntityFieldLabels={(relation) =>
                      entityRelationsLabelsMap.data?.[relation] ||
                      getEntitiesDictionPlurals(relation)
                    }
                    crudConfig={MAKE_APP_CONFIGURATION_CRUD_CONFIG(
                      "hidden_entity_relations"
                    )}
                    hiddenList={hiddenEntityRelations.data}
                    onSubmit={upsertHideEntityRelationMutation.mutateAsync}
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
                  loader={loadingFieldsLabelForm}
                >
                  <Spacer />
                  <FieldsLabelForm
                    initialValues={entityRelationsLabelsMap.data}
                    crudConfig={MAKE_APP_CONFIGURATION_CRUD_CONFIG(
                      "entity_relations_labels"
                    )}
                    fields={referenceFields.data.map(({ table }) => table)}
                    onSubmit={upsertEntityRelationsLabelsMutation.mutateAsync}
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
                  loader={<ListSkeleton count={5} />}
                >
                  <SortList
                    data={{
                      ...referenceFields,
                      data: referenceFields.data.map(({ table, label }) => ({
                        value: table,
                        label: label || getEntitiesDictionPlurals(table),
                      })),
                    }}
                    onSave={upsertEntityRelationsOrderMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
              label: "Order",
            },
          ]}
        />
      </SectionBox>
      <RelationsSettingsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
