import { AppLayout } from "frontend/_layouts/app";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityDataCreationMutation } from "frontend/hooks/data/data.store";
import {
  useEntityCrudConfig,
  useEntitySlug,
} from "frontend/hooks/entity/entity.config";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useRouteParams } from "frontend/lib/routing/useRouteParam";
import { META_USER_PERMISSIONS } from "shared/constants/user";

import { ContentLayout } from "@/components/app/content-layout";
import { SectionBox } from "@/components/app/section-box";

import { useEntityActionMenuItems } from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";
import { PortalEntityFormComponent } from "../portal";
import { runInitialValuesScript } from "./run-initial-values-scripts";

export function EntityCreate() {
  const routeParams = useRouteParams();
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig(entity);

  const entityDataCreationMutation = useEntityDataCreationMutation(entity);
  const evaluateScriptContext = useEvaluateScriptContext();

  const actionItems = useEntityActionMenuItems(entity);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.CREATE,
    viewKey: "CREATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const { backLink } = useNavigationStack();

  const entityFormExtension = useEntityConfiguration(
    "entity_form_extension",
    entity
  );

  const scriptInitialValues = runInitialValuesScript(
    entityFormExtension.data.initialValues,
    evaluateScriptContext
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
            systemIcon="Plus"
            crudAction="create"
            resetForm
            buttonText={entityCrudConfig.FORM_LANG.CREATE}
            initialValuesData={{
              data: { ...scriptInitialValues, ...routeParams },
              error: entityFormExtension.error,
              isLoading: entityFormExtension.isLoading,
            }}
            onSubmit={entityDataCreationMutation.mutateAsync}
          />
        </SectionBox>
      </ContentLayout.Center>
      <PortalEntityFormComponent />
    </AppLayout>
  );
}
