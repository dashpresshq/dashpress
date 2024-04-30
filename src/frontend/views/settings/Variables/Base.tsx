import { useState } from "react";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { Card } from "frontend/design-system/components/Card";
import { Tabs } from "frontend/design-system/components/Tabs";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { ManageCredentialGroup } from "./ManageCredentialGroup";
import { INTEGRATIONS_GROUP_CRUD_CONFIG } from "./constants";

export function BaseManageVariables() {
  const [currentTab, setCurrentTab] = useState<IntegrationsConfigurationGroup>(
    IntegrationsConfigurationGroup.Constants
  );
  const constantsDomainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG.constants.domainDiction
  );

  const credentialsDomainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG.constants.domainDiction
  );

  return (
    <Card>
      <Tabs
        padContent={false}
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
    </Card>
  );
}

export const ManageVariablesPageTitle = msg`Manage Variables`;
