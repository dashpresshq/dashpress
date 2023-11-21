import { useState } from "react";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { Card } from "frontend/design-system/components/Card";
import { Tabs } from "frontend/design-system/components/Tabs";
import { ManageCredentialGroup } from "./ManageCredentialGroup";

export function BaseManageVariables() {
  const [currentTab, setCurrentTab] = useState<IntegrationsConfigurationGroup>(
    IntegrationsConfigurationGroup.Constants
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
            overrideLabel:
              INTEGRATIONS_GROUP_CONFIG.constants.crudConfig.TEXT_LANG.TITLE,
            label: IntegrationsConfigurationGroup.Constants,
            content: (
              <ManageCredentialGroup
                group={IntegrationsConfigurationGroup.Constants}
                currentTab={currentTab}
              />
            ),
          },
          {
            overrideLabel:
              INTEGRATIONS_GROUP_CONFIG.credentials.crudConfig.TEXT_LANG.TITLE,
            label: IntegrationsConfigurationGroup.Credentials,
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

export const ManageVariablesPageTitle = "Manage Variables";
