import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IPerformsImplementation {
  label: string;
  configurationSchema: Record<string, string>;
  do: () => Promise<any>;
}

export interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: IAppliedSchemaFormConfig<any>;
  performsImplementation: Record<string, IPerformsImplementation>;
}
