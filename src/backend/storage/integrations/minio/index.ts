import { msg } from "@lingui/macro";

import type { IStorageIntegrationsImplemention } from "@/backend/storage/types";

export const MINIO_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  endpoint: string;
  port: string;
  accessKey: string;
  secretKey: string;
}> = {
  title: "Minio",
  integrationConfigurationSchema: {
    endpoint: {
      label: msg`Endpoint`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    port: {
      label: msg`Port`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    accessKey: {
      label: msg`Access Key`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    secretKey: {
      label: msg`Secret Key`,
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
