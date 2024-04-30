import { msg } from "@lingui/macro";
import {
  MAKE_CRUD_CONFIG,
  MAKE_ENDPOINTS_CONFIG,
} from "frontend/lib/crud-config";

export const FORM_ACTION_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Form Actions`,
  singular: msg`Form Action`,
});

export const FORM_ACTION_ENDPOINT = MAKE_ENDPOINTS_CONFIG(`/api/form-actions`);
