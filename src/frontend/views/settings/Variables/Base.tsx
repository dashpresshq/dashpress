import { StyledCard, Tabs } from "@hadmean/chromista";
import { useState } from "react";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_CONFIG } from "./constants";
import { ManageCredentialGroup } from "./ManageCredentialGroup";

export function BaseManageVariables() {
  const [currentTab, setCurrentTab] = useState<IntegrationsConfigurationGroup>(
    IntegrationsConfigurationGroup.Constants
  );
  return (
    <StyledCard>
      <Tabs
        padContent={false}
        currentTab={currentTab}
        onChange={(newTab) =>
          setCurrentTab(newTab as IntegrationsConfigurationGroup)
        }
        contents={[
          {
            overrideLabel: INTEGRATIONS_GROUP_CONFIG.constants.label,
            label: IntegrationsConfigurationGroup.Constants,
            content: (
              <ManageCredentialGroup
                group={IntegrationsConfigurationGroup.Constants}
                currentTab={currentTab}
              />
            ),
          },
          {
            overrideLabel: INTEGRATIONS_GROUP_CONFIG.credentials.label,
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
    </StyledCard>
  );
}

export const MangeVariablesPageTitle = "Manage Variables";
