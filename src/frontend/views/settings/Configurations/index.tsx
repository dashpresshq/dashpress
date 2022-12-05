import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { Spacer } from "@hadmean/chromista";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseIntegrationsConfiguration } from "./Base";

export function IntegrationsConfigurationSettings() {
  useSetPageDetails({
    pageTitle: "Manage Constants",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Constants}
      />
      <Spacer />
      <BaseIntegrationsConfiguration
        group={IntegrationsConfigurationGroup.Credentials}
      />
    </BaseSettingsLayout>
  );
}
