import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { useState } from "react";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

import { Tabs } from "@/components/app/tabs";

import { INTEGRATIONS_GROUP_CRUD_CONFIG } from "./constants";
import { ManageCredentialGroup } from "./ManageCredentialGroup";

export function BaseManageVariables() {
  const [currentTab, setCurrentTab] = useState<IntegrationsConfigurationGroup>(
    IntegrationsConfigurationGroup.Constants
  );
  const constantsDomainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG.constants.domainDiction
  );

  const credentialsDomainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG.credentials.domainDiction
  );

  return (
    <Tabs
      currentTab={currentTab}
      onChange={(newTab) =>
        setCurrentTab(newTab as IntegrationsConfigurationGroup)
      }
      contents={[
        {
          label: constantsDomainMessages.TEXT_LANG.TITLE,
          id: IntegrationsConfigurationGroup.Constants,
          content: (
            <ManageCredentialGroup
              group={IntegrationsConfigurationGroup.Constants}
              currentTab={currentTab}
            />
          ),
        },
        {
          label: credentialsDomainMessages.TEXT_LANG.TITLE,
          id: IntegrationsConfigurationGroup.Credentials,
          content: (
            <ManageCredentialGroup
              group={IntegrationsConfigurationGroup.Credentials}
              currentTab={currentTab}
            />
          ),
        },
      ]}
    />
  );
}

export const ManageVariablesPageTitle = msg`Manage Variables`;
