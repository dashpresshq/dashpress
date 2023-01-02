import { IStorageIntegrationsImplemention } from "backend/storage/types";

// https://www.npmjs.com/package/multer-s3

export const AWS_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<
  {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  },
  {
    bucket: string;
  }
> = {
  title: "AWS S3",
  credentialsGroupKey: "AWS_S3",
  packages: ["aws-sdk"],
  integrationConfigurationSchema: {
    accessKeyId: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    secretAccessKey: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    region: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  },
  uploadConfigurationSchema: {
    bucket: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  },
  store: async (integrationConfig, uploadConfig, file: File) => {
    // const foo = new S3Client({
    //   region: "string",
    // });
    // eslint-disable-next-line no-console
    console.log(integrationConfig, uploadConfig, file);
    return "";
  },
};
