import { IActionIntegrationsImplemention } from "shared/types/actions";
import { HTTP_ACTION_INTEGRATION } from "./http";
import { SLACK_ACTION_INTEGRATION } from "./slack";
import { SMTP_ACTION_INTEGRATION } from "./smtp";

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  http: HTTP_ACTION_INTEGRATION,
  slack: SLACK_ACTION_INTEGRATION,
  smtp: SMTP_ACTION_INTEGRATION,
  jira: SLACK_ACTION_INTEGRATION,
  twilio: SLACK_ACTION_INTEGRATION,
  zapier: SLACK_ACTION_INTEGRATION,
};
