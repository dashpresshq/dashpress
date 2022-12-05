import { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { label: string; singular: string; prefix: string }
> = {
  constants: {
    label: "Constants",
    singular: "Constant",
    prefix: "CONSTANT",
  },
  env: {
    label: "Environment Variables",
    singular: "Environment Variable",
    prefix: "ENV",
  },
  credentials: {
    label: "Credentials",
    singular: "Credential",
    prefix: "CREDENTIAL",
  },
};
