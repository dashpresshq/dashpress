import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IStorageIntegrationsImplemention<T> {
  title: string;
  credentialsGroupKey: string;
  packages: string[];
  configurationSchema: IAppliedSchemaFormConfig<T>;
  store: (config: T, file: File) => Promise<string>;
}
