import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { integrationsConfigurationDetailsRequestHandler } from "../_base/[key]";

export default integrationsConfigurationDetailsRequestHandler(
  IntegrationsConfigurationGroup.Constants
);
