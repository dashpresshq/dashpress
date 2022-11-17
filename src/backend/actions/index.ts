import { HTTP_ACTION_INTEGRATION } from "./http";
import { SLACK_ACTION_INTEGRATION } from "./slack";
import { IActionIntegrationsImplemention } from "./types";

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  HTTP: HTTP_ACTION_INTEGRATION,
  SLACK: SLACK_ACTION_INTEGRATION,
};
