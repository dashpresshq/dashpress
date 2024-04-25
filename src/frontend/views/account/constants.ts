import { msg } from "@lingui/macro";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";

export const ACCOUNT_VIEW_KEY = "ACCOUNT_VIEW_KEY";

export const PASSWORD_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Password`,
  singular: msg`Password`,
});
