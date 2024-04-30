import { useState } from "react";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { Card } from "frontend/design-system/components/Card";
import { Tabs } from "frontend/design-system/components/Tabs";
import { msg } from "@lingui/macro";
import { ManageCredentialGroup } from "./ManageCredentialGroup";
import { INTEGRATIONS_GROUP_CRUD_CONFIG } from "./constants";

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
            label:
              INTEGRATIONS_GROUP_CRUD_CONFIG.constants.crudConfig.TEXT_LANG
                .TITLE,
            id: IntegrationsConfigurationGroup.Constants,
            content: (
              <ManageCredentialGroup
                group={IntegrationsConfigurationGroup.Constants}
                currentTab={currentTab}
              />
            ),
          },
          {
            label:
              INTEGRATIONS_GROUP_CRUD_CONFIG.credentials.crudConfig.TEXT_LANG
                .TITLE,
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
