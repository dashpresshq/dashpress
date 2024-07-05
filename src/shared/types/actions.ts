import type { MessageDescriptor } from "@lingui/core";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

import type { DataEventActions } from "./data";

export enum ActionIntegrations {
  HTTP = "http",
  SMTP = "smtp",
  SLACK = "slack",
  TWILIO = "twilio",
  SENDGRID = "sendgrid",
  POSTMARK = "postmark",
  MAILGUN = "mailgun",
  SEND_IN_BLUE = "sendInBlue",
}

export type IFormAction = {
  id: string;
  integration: ActionIntegrations;
  entity: string;
  action: string;
  trigger: DataEventActions;
  configuration: Record<string, string>;
};

export interface IPerformsImplementation {
  label: MessageDescriptor;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  do: (connection: unknown, configuration: unknown) => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  connect: (config: Record<string, unknown>) => Promise<unknown>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

export interface IStorageIntegration {
  title: string;
  key: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
}

export type IIntegrationsList = { key: ActionIntegrations } & Pick<
  IActionIntegrationsImplemention,
  "title" | "description" | "configurationSchema"
>;

export type IIntegrationImplementationList = { key: string } & Pick<
  IPerformsImplementation,
  "label" | "configurationSchema"
>;
