import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const LOCAL_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Local Storage",
  credentialsGroupKey: "FILE",
  packages: [],
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
