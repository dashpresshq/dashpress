import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { integrationsConfigurationListRequestHandler } from "../_base";

export default integrationsConfigurationListRequestHandler(
  IntegrationsConfigurationGroup.Env
);
