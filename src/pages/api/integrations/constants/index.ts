import { IntegrationsConfigurationGroup } from "backend/integrations-configurations/integrations-configurations.controller";
import { integrationsConfigurationListRequestHandler } from "../_base";

export default integrationsConfigurationListRequestHandler(
  IntegrationsConfigurationGroup.AppConstants
);
