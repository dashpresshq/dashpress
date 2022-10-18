import { IntegrationsConfigurationGroup } from "backend/integrations-configurations/integrations-configurations.controller";
import { integrationsConfigurationDetailsRequestHandler } from "../_base";

export default integrationsConfigurationDetailsRequestHandler(
  IntegrationsConfigurationGroup.Credentials
);
