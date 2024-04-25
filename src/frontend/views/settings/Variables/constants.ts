import { msg } from "@lingui/macro";
import { ICrudConfig, MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

export const INTEGRATIONS_GROUP_CRUD_CONFIG: Record<
  IntegrationsConfigurationGroup,
  { crudConfig: ICrudConfig }
> = {
  constants: {
    crudConfig: MAKE_CRUD_CONFIG({
      plural: msg`Constants`,
      singular: msg`Constant`,
    }),
  },
  env: {
    crudConfig: MAKE_CRUD_CONFIG({
      plural: msg`Environment Variables`,
      singular: msg`Environment Variable`,
    }),
  },
  credentials: {
    crudConfig: MAKE_CRUD_CONFIG({
      plural: msg`Secrets`,
      singular: msg`Secret`,
    }),
  },
};
