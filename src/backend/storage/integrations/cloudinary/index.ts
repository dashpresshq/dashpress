import { IStorageIntegrationsImplemention } from "backend/storage/types";

export const CLOUDINARY_STORAGE_INTEGRATION: IStorageIntegrationsImplemention<{
  folder: string;
}> = {
  title: "Cloudinary",
  packages: ["cloudinary", "multer-storage-cloudinary"],
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
  store: async () => {
    // const cloudinary = require("cloudinary").v2;
    // const { CloudinaryStorage } = require("multer-storage-cloudinary");

    // const storage = new CloudinaryStorage({
    //   cloudinary,
    //   params: {
    //     folder: "some-folder-name",
    //     format: async (req, file) => "png",
    //     public_id: (req, file) => "computed-filename-using-request",
    //   },
    // });

    // storage._handleFile(req, file, (details) => {});

    return "";
  },
};
