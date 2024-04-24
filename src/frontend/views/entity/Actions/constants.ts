import { t } from "@lingui/macro";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";

export const FORM_ACTION_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: `/api/form-actions`,
  plural: "Form Actions",
  singular: t`Form Action`,
});
