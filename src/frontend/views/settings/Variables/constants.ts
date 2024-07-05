import type { MessageDescriptor } from "@lingui/core";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import type { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CRUD_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { domainDiction: { plural: MessageDescriptor; singular: MessageDescriptor } }
> = {
  constants: {
    domainDiction: LANG_DOMAINS.INTEGRATIONS.CONSTANTS,
  },
  env: {
    domainDiction: LANG_DOMAINS.INTEGRATIONS.ENVIRONMENT_VARIABLES,
  },
  credentials: {
    domainDiction: LANG_DOMAINS.INTEGRATIONS.CREDENTIALS,
  },
};
