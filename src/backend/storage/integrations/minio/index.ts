import { IStorageIntegrationsImplemention } from "backend/storage/types";

// https://www.npmjs.com/package/multer-minio-storage-engine

export const MINIO_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Minio",
  credentialsGroupKey: "MINIO",
  packages: ["multer-minio-storage-engine@1.0.0", "minio"],
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
