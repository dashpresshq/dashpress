import { msg } from "@lingui/macro";

import { SectionBox } from "@/components/app/section-box";
import { useDocumentationActionButton } from "@/frontend/docs/constants";
import { FormIntegrationsDocumentation } from "@/frontend/docs/form-integrations";
import { useEntitySlug } from "@/frontend/hooks/entity/entity.config";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { UserPermissions } from "@/shared/constants/user";

import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { FormActions } from "./Base";

export function EntityFormActionsSettings() {
  const entity = useEntitySlug();
  const domainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FORM_ACTIONS
  );
  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
        actionButtons={[
          {
            id: "manage",
            action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
            systemIcon: "Settings",
            label: msg`Manage Variables`,
          },
          documentationActionButton,
        ]}
      >
        <FormActions entity={entity} />
      </SectionBox>
      <FormIntegrationsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
