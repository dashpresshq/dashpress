import { IStorageIntegrationsImplemention } from "backend/storage/types";

// https://www.npmjs.com/package/multer-cloud-storage

export const GOOGLE_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<
  {},
  {
    folder: string;
  }
> = {
  title: "Google Cloud Storage",
  credentialsGroupKey: "GOOGLE_CLOUD_STORAGE",
  packages: ["aws-sdk"],
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
