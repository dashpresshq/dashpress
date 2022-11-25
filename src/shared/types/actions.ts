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
  performKey: string;
  triggerLogic: string;
  formAction: "create" | "update";
  configuration: Record<string, string>;
}

// Entity Will be inferred
// entity;

// formaction : selection
// activatedActionId : selection
// performKey ? the action to actuall perform
// triggerLogic : JSON
// configuration: <Schema />

// Table
// Entity
// action
// performKey

export interface IPerformsImplementation {
  label: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  do: (
    connection: unknown,
    configuration: Record<string, unknown>
  ) => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  connect: (config: Record<string, unknown>) => Promise<unknown>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

export type IActionsList = { key: string } & Pick<
  IActionIntegrationsImplemention,
  "title" | "description" | "configurationSchema"
>;

export const HTTP_ACTION_KEY = "http";
