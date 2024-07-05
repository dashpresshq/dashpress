import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IStorageIntegrationsImplemention<T> {
  title: string;
  integrationConfigurationSchema: IAppliedSchemaFormConfig<T>;
  store: (integrationConfig: T, file: File) => Promise<string>;
}
