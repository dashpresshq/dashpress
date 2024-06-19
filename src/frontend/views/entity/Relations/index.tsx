import {
  ENTITY_RELATIONS_ENDPOINT,
  useEntityFields,
  useEntityReferenceFields,
  useEntityRelationsList,
} from "frontend/hooks/entity/entity.store";
import { EntitiesSelection } from "frontend/views/settings/Entities/Selection";
import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { UserPermissions } from "shared/constants/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { RelationsSettingsDocumentation } from "frontend/docs/relations";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ListSkeleton } from "@/components/app/skeleton/list";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Tabs } from "@/components/app/tabs";
import {
  FieldsLabelForm,
  loadingFieldsLabelForm,
} from "../Fields/FieldsLabel.form";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityRelationsForm } from "./Relations.form";
import { BaseEntitySettingsLayout } from "../_Base";

const RELATIONSHIP_SETTINGS = msg`Relationship Settings`;

export function EntityRelationsSettings() {
  const entity = useEntitySlug();
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const entityFields = useEntityFields(entity);
  const entityRelationList = useEntityRelationsList(entity);
  const referenceFields = useEntityReferenceFields(entity);
  const domainMessages = useAppConfigurationDomainMessages(
    "entity_relations_labels"
  );
  useSetPageDetails({
    pageTitle: RELATIONSHIP_SETTINGS,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const entityRelationTemplate = useEntityConfiguration(
    "entity_relation_template",
    entity
  );

  const hiddenEntityRelations = useEntityConfiguration(
    "hidden_entity_relations",
    entity
  );

  const documentationActionButton = useDocumentationActionButton(
    RELATIONSHIP_SETTINGS
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

  const entityRelationsOrder = useEntityConfiguration(
    "entity_relations_order",
    entity
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
    entityRelationsOrder.error ||
    entityRelationList.error ||
    hiddenEntityRelations.error;

  const isLoading =
    entityFields.isLoading ||
    entityRelationList.isLoading ||
    entityRelationsOrder.isLoading ||
    entityRelationTemplate.isLoading ||
    hiddenEntityRelations.isLoading ||
    referenceFields.isLoading;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={RELATIONSHIP_SETTINGS}
        actionButtons={[documentationActionButton]}
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
              id: "template",
              label: msg`Reference Template`,
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={<ListSkeleton count={5} />}
                >
                  <div className="mt-6">
                    <EntitiesSelection
                      type="relations"
                      selectionKey={`${entity}-relations`}
                      allList={entityRelationList.data}
                      getEntityFieldLabels={(relation) =>
                        entityRelationsLabelsMap.data?.[relation] ||
                        getEntitiesDictionPlurals(relation)
                      }
                      sort={{
                        order: entityRelationsOrder.data,
                        save: upsertEntityRelationsOrderMutation.mutateAsync,
                      }}
                      hiddenList={hiddenEntityRelations.data}
                      onSubmit={upsertHideEntityRelationMutation.mutateAsync}
                    />
                  </div>
                </ViewStateMachine>
              ),
              id: "selection",
              label: msg`Selection`,
            },
            {
              content: (
                <ViewStateMachine
                  error={error}
                  loading={isLoading}
                  loader={loadingFieldsLabelForm}
                >
                  <FieldsLabelForm
                    initialValues={entityRelationsLabelsMap.data}
                    crudConfig={domainMessages}
                    fields={referenceFields.data.map(({ table }) => table)}
                    onSubmit={upsertEntityRelationsLabelsMutation.mutateAsync}
                  />
                </ViewStateMachine>
              ),
              id: "labels",
              label: msg`Labels`,
            },
          ]}
        />
      </SectionBox>
      <RelationsSettingsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
