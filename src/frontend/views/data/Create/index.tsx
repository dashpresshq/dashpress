import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { AppLayout } from "frontend/_layouts/app";
import {
  useEntityCrudConfig,
  useEntitySlug,
  useHiddenEntityColumns,
} from "frontend/hooks/entity/entity.config";
import { useEntityDataCreationMutation } from "frontend/hooks/data/data.store";
import { useRouteParams } from "frontend/lib/routing/useRouteParam";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { evalJavascriptStringSafely } from "frontend/lib/script-runner";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";

const runInitialValuesScript = (
  initialValuesScript: string
): Record<string, unknown> => {
  if (!initialValuesScript) {
    return {};
  }

  const response = evalJavascriptStringSafely<{}>(initialValuesScript, {});

  if (typeof response !== "object") {
    return {};
  }
  return response;
};

export function EntityCreate() {
  const routeParams = useRouteParams();
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig();

  const entityDataCreationMutation = useEntityDataCreationMutation(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Create,
    EntityActionTypes.Form,
  ]);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.CREATE,
    viewKey: "CREATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const hiddenCreateColumns = useHiddenEntityColumns("create");

  const { backLink } = useNavigationStack();

  const entityFormExtension = useEntityConfiguration(
    "entity_form_extension",
    entity
  );

  const scriptInitialValues = runInitialValuesScript(
    entityFormExtension.data.initialValues
  );

  return (
    <AppLayout actionItems={actionItems}>
      <ContentLayout.Center>
        <SectionBox
          title={entityCrudConfig.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <BaseEntityForm
            entity={entity}
            icon="add"
            crudAction="create"
            resetForm
            buttonText={entityCrudConfig.FORM_LANG.CREATE}
            initialValues={{ ...scriptInitialValues, ...routeParams }}
            onSubmit={entityDataCreationMutation.mutateAsync}
            hiddenColumns={hiddenCreateColumns}
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
