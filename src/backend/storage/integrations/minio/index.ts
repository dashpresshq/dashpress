import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const MINIO_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Minio",
  credentialsGroupKey: "MINIO",
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
