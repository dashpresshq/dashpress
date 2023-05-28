import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import {
  AppConfigurationKeys,
  CONFIGURATION_KEYS,
} from "shared/configurations";

export const MAKE_APP_CONFIGURATION_CRUD_CONFIG = (
  key: AppConfigurationKeys
) => {
  return MAKE_CRUD_CONFIG({
    path: "N/A",
    plural: CONFIGURATION_KEYS[key].crudConfigLabel,
    singular: CONFIGURATION_KEYS[key].crudConfigLabel,
  });
};
