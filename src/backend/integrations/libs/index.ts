import type { IActionIntegrationsImplemention } from "shared/types/actions";
import { ActionIntegrations } from "shared/types/actions";
import { HTTP_ACTION_INTEGRATION } from "./http";
import { MAIL_GUN_ACTION_INTEGRATION } from "./mailgun";
import { POST_MARK_ACTION_INTEGRATION } from "./postmark";
import { SEND_GRID_ACTION_INTEGRATION } from "./sendgrid";
import { SENDINBLUE_ACTION_INTEGRATION } from "./sendinblue";
import { SLACK_ACTION_INTEGRATION } from "./slack";
import { SMTP_ACTION_INTEGRATION } from "./smtp";
import { TWILIO_ACTION_INTEGRATION } from "./twilio";

export const ACTION_INTEGRATIONS: Record<
  ActionIntegrations,
  IActionIntegrationsImplemention
> = {
  [ActionIntegrations.HTTP]: HTTP_ACTION_INTEGRATION,
  [ActionIntegrations.SMTP]: SMTP_ACTION_INTEGRATION,
  [ActionIntegrations.SLACK]: SLACK_ACTION_INTEGRATION,
  [ActionIntegrations.SENDGRID]: SEND_GRID_ACTION_INTEGRATION,
  [ActionIntegrations.MAILGUN]: MAIL_GUN_ACTION_INTEGRATION,
  [ActionIntegrations.TWILIO]: TWILIO_ACTION_INTEGRATION,
  [ActionIntegrations.POSTMARK]: POST_MARK_ACTION_INTEGRATION,
  [ActionIntegrations.SEND_IN_BLUE]: SENDINBLUE_ACTION_INTEGRATION,
};
