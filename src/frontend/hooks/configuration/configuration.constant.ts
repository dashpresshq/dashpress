import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import {
  AppConfigurationKeys,
  APP_CONFIGURATION_CONFIG,
} from "shared/configurations";

export const MAKE_APP_CONFIGURATION_CRUD_CONFIG = (
  key: AppConfigurationKeys
) => {
  return MAKE_CRUD_CONFIG({
    plural: APP_CONFIGURATION_CONFIG[key].label,
    singular: APP_CONFIGURATION_CONFIG[key].label,
  });
};
