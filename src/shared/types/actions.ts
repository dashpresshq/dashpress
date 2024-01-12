import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { DataEventActions } from "./data";

export enum ActionIntegrationKeys {
  HTTP = "http",
  SMTP = "smtp",
  SLACK = "slack",
  TWILIO = "twilio",
  SENDGRID = "sendgrid",
  POSTMARK = "postmark",
  MAILGUN = "mailgun",
  SEND_IN_BLUE = "sendInBlue",
}

export type IActionInstance = {
  instanceId: string;
  integrationKey: ActionIntegrationKeys;
  entity: string;
  implementationKey: string;
  formAction: DataEventActions;
  configuration: Record<string, string>;
};

export interface IPerformsImplementation {
  label: string;
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

export type IIntegrationsList = { key: ActionIntegrationKeys } & Pick<
  IActionIntegrationsImplemention,
  "title" | "description" | "configurationSchema"
>;

export type IIntegrationImplementationList = { key: string } & Pick<
  IPerformsImplementation,
  "label" | "configurationSchema"
>;
