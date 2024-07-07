import type { IStorageIntegrationsImplemention } from "@/backend/storage/types";

export const CLOUDINARY_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{}> =
  {
    title: "Cloudinary",
    integrationConfigurationSchema: {
      apiKey: {
        type: "text",
        validations: [
          {
            validationType: "required",
          },
        ],
      },
      apiSecret: {
        type: "text",
        validations: [
          {
            validationType: "required",
          },
        ],
      },
      cloudName: {
        type: "text",
        validations: [
          {
            validationType: "required",
          },
        ],
      },
    },
    store: async (integrationConfig, file) => {
      return `${integrationConfig}  ${file}`;
    },
  };
