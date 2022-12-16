import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const GOOGLE_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Google Cloud Storage",
  credentialsGroupKey: "GOOGLE_CLOUD_STORAGE",
  packages: ["aws-sdk"],
  configurationSchema: {
    folder: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  },
  store: async (config, file: File) => {
    // eslint-disable-next-line no-console
    console.log(config, file);
    return "";
  },
};
