import { SectionBox } from "@hadmean/chromista";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { FormIntegrationsDocumentation } from "frontend/docs/form-integrations";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { BaseActionInstances } from "./Base";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "./constants";

const DOCS_TITLE = ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.TITLE;

export function EntityFormActionsSettings() {
  const entity = useEntitySlug();
  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });
  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.TITLE}
        iconButtons={[
          {
            action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
            icon: "settings",
            label: "Manage Variables",
          },
          {
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
          },
        ]}
      >
        <BaseActionInstances id={entity} type="entity" />
      </SectionBox>
      <FormIntegrationsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseEntitySettingsLayout>
  );
}
