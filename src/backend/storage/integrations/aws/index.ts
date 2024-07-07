import { msg } from "@lingui/macro";

import type { IStorageIntegrationsImplemention } from "@/backend/storage/types";

export const AWS_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}> = {
  title: "AWS S3",
  integrationConfigurationSchema: {
    accessKeyId: {
      label: msg`Access Key ID`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    secretAccessKey: {
      label: msg`Secret Access Key`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    region: {
      label: msg`Region`,
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
