import { IStorageIntegrationsImplemention } from "backend/storage/types";

// https://github.com/khaosdoctor/multer-firebase-storage

export const FIREBASE_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<
  {},
  {
    folder: string;
  }
> = {
  title: "Firebase Storage",
  credentialsGroupKey: "FIREBASE_STORAGE",
  packages: [],
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
  integrationConfigurationSchema: {},
  store: async (integrationConfig, uploadConfig, file: File) => {
    // eslint-disable-next-line no-console
    console.log(integrationConfig, uploadConfig, file);
    return "";
  },
};
