import { ICrudConfig, MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { crudConfig: ICrudConfig; prefix: string }
> = {
  constants: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Constants",
      singular: "Constant",
    }),
    prefix: "CONSTANT",
  },
  env: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Environment Variables",
      singular: "Environment Variable",
    }),
    prefix: "ENV",
  },
  credentials: {
    crudConfig: MAKE_CRUD_CONFIG({
      path: "N/A",
      plural: "Secrets",
      singular: "Secret",
    }),
    prefix: "SECRET",
  },
};
