import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const AWS_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}> = {
  title: "AWS S3",
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
  store: async (integrationConfig, file: File) => {
    // const foo = new S3Client({
    //   region: "string",
    // });
    // eslint-disable-next-line no-console
    console.log(integrationConfig, file);
    return "";
  },
};
