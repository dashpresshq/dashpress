import { IActionIntegrationsImplemention } from "shared/types/actions";
import { HTTP_ACTION_INTEGRATION } from "./http";
import { SLACK_ACTION_INTEGRATION } from "./slack";

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  http: HTTP_ACTION_INTEGRATION,
  slack: SLACK_ACTION_INTEGRATION,
};
