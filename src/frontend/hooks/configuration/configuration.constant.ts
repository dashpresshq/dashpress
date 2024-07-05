import { useDomainMessages } from "frontend/lib/crud-config";
import type { AppConfigurationKeys } from "shared/configurations";
import { APP_CONFIGURATION_CONFIG } from "shared/configurations";

export const useAppConfigurationDomainMessages = (
  key: AppConfigurationKeys
) => {
  return useDomainMessages({
    plural: APP_CONFIGURATION_CONFIG[key].label,
    singular: APP_CONFIGURATION_CONFIG[key].label,
  });
};
