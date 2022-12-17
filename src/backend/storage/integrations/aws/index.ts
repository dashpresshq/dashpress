import { IStorageIntegrationsImplemention } from "backend/storage/types";

// https://www.npmjs.com/package/multer-s3

export const AWS_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "AWS S3",
  credentialsGroupKey: "AWS_S3",
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
