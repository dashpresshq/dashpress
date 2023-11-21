import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const GOOGLE_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{}> =
  {
    title: "Google Cloud Storage",
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
      // eslint-disable-next-line no-console
      console.log(integrationConfig, file);
      return "";
    },
  };
