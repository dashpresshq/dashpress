import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const CLOUDINARY_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{}> =
  {
    title: "Cloudinary",
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
    store: async (integrationConfig, file) => {
      return `${integrationConfig}  ${file}`;
    },
  };
