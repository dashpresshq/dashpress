import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

export interface IStorageIntegrationsImplemention<T, K> {
  title: string;
  credentialsGroupKey: string;
  packages: string[];
  uploadConfigurationSchema: IAppliedSchemaFormConfig<K>;
  integrationConfigurationSchema: IAppliedSchemaFormConfig<T>;
  store: (integrationConfig: T, uploadConfig: T, file: File) => Promise<string>;
}

export const FOR_CODE_COV = 1;
