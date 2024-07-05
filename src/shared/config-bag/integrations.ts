import type { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { prefix: string }
> = {
  constants: {
    prefix: "CONSTANT",
  },
  env: {
    prefix: "ENV",
  },
  credentials: {
    prefix: "SECRET",
  },
};
