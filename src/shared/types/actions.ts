import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IActivatedAction {
  activationId: string;
  integrationKey: string;
  credentialsGroupKey: string;
}

export interface IActionsToTrigger {
  triggerId: string;
  activatedActionId: string;
  entity: string;
  triggerLogic: string;
  formAction: "create" | "update";
  configuration: Record<string, string>;
}

export interface IPerformsImplementation {
  label: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  do: (
    connection: unknown,
    configuration: Record<string, string>
  ) => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  connect: (config: Record<string, string>) => Promise<unknown>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

export type IActionsList = { key: string } & Pick<
  IActionIntegrationsImplemention,
  "title" | "description" | "configurationSchema"
>;
