import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const LOCAL_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<
  {},
  {
    folder: string;
  }
> = {
  title: "Local Storage",
  credentialsGroupKey: "FILE",
  packages: [],
  integrationConfigurationSchema: {},
  uploadConfigurationSchema: {
    folder: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  },
  store: async (integrationConfig, uploadConfig, file) => {
    // eslint-disable-next-line no-console
    console.log(integrationConfig, uploadConfig, file);
    return "";
  },
};
