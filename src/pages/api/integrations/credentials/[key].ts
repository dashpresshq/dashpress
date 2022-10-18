import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { integrationsConfigurationDetailsRequestHandler } from "../_base";

export default integrationsConfigurationDetailsRequestHandler(
  IntegrationsConfigurationGroup.Credentials
);
