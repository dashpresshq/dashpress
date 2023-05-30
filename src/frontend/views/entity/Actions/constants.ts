import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";

export const BASE_ACTIONS_ENDPOINT = `/api/integrations/actions`;

export const ADMIN_ACTION_INSTANCES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: `${BASE_ACTIONS_ENDPOINT}/instances`,
  plural: "Form Actions",
  singular: "Form Action",
});
