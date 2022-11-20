import { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_LABEL: Record<
  IntegrationsConfigurationGroup,
  { label: string; singular: string }
> = {
  constants: {
    label: "Constants",
    singular: "Constant",
  },
  env: {
    label: "Environment Variables",
    singular: "Environment Variable",
  },
};
