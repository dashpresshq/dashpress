import { ICrudConfig, MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CRUD_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { crudConfig: ICrudConfig }
> = {
  constants: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Constants",
      singular: "Constant",
    }),
  },
  env: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Environment Variables",
      singular: "Environment Variable",
    }),
  },
  credentials: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Secrets",
      singular: "Secret",
    }),
  },
};
