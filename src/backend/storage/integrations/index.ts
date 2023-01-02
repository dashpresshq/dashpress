import { IStorageIntegrationsImplemention } from "../types";
import { AWS_STORAGE_INTEGRATION } from "./aws";
import { CLOUDINARY_STORAGE_INTEGRATION } from "./cloudinary";
import { FIREBASE_STORAGE_INTEGRATION } from "./firebase";
import { GOOGLE_STORAGE_INTEGRATION } from "./google";
import { LOCAL_STORAGE_INTEGRATION } from "./local";
import { MINIO_STORAGE_INTEGRATION } from "./minio";

export const STORAGE_INTEGRATIONS: Record<
  string,
  IStorageIntegrationsImplemention<any, any>
> = {
  file: LOCAL_STORAGE_INTEGRATION,
  s3: AWS_STORAGE_INTEGRATION,
  firebase: FIREBASE_STORAGE_INTEGRATION,
  minio: MINIO_STORAGE_INTEGRATION,
  cloudinary: CLOUDINARY_STORAGE_INTEGRATION,
  google: GOOGLE_STORAGE_INTEGRATION,
  // digital: Digital Ocean Space
};

// const AWS = require("aws-sdk");
// const fs = require("fs");
// const dotenv = require("dotenv");

// dotenv.configure();
// const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
// const s3 = new AWS.S3({endpoint: spacesEndpoint, accessKeyId: process.env.DO_SPACES_KEY, secretAccessKey: process.env.DO_SPACES_SECRET});

// const file = fs.readFileSync("path/to/file.jpg");

// s3.putObjet({Bucket: process.env.DO_SPACES_NAME, Key: "any_file_or_path_name.jpg", Body: file, ACL: "public"}, (err, data) => {
//     if (err) return console.log(err);
//     console.log("Your file has been uploaded successfully!", data);
// });
