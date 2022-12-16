import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const CLOUDINARY_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Cloudinary",
  packages: ["aws-sdk"],
  credentialsGroupKey: "CLOUDINARY",
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
