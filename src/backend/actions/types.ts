import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

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
