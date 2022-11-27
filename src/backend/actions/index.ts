import {
  HTTP_ACTION_KEY,
  IActionIntegrationsImplemention,
} from "shared/types/actions";
import { HTTP_ACTION_INTEGRATION } from "./http";
import { MAIL_GUN_ACTION_INTEGRATION } from "./mailgun";
import { SEND_GRID_ACTION_INTEGRATION } from "./sendgrid";
import { SLACK_ACTION_INTEGRATION } from "./slack";
import { SMTP_ACTION_INTEGRATION } from "./smtp";

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  [HTTP_ACTION_KEY]: HTTP_ACTION_INTEGRATION,
  slack: SLACK_ACTION_INTEGRATION,
  smtp: SMTP_ACTION_INTEGRATION,
  sendgrid: SEND_GRID_ACTION_INTEGRATION,
  mailgun: MAIL_GUN_ACTION_INTEGRATION,
  twilio: SLACK_ACTION_INTEGRATION,
  zapier: SLACK_ACTION_INTEGRATION,
  // stripe: SLACK_ACTION_INTEGRATION,
};

// : string;
// configuration: Record<string, string>;
