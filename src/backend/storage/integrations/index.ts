import { IStorageIntegrationsImplemention } from "../types";
import { AWS_STORAGE_INTEGRATION } from "./aws";
import { CLOUDINARY_STORAGE_INTEGRATION } from "./cloudinary";
import { FIREBASE_STORAGE_INTEGRATION } from "./firebase";
import { GOOGLE_STORAGE_INTEGRATION } from "./google";
import { LOCAL_STORAGE_INTEGRATION } from "./local";
import { MINIO_STORAGE_INTEGRATION } from "./minio";

export const STORAGE_INTEGRATIONS: Record<
  string,
  IStorageIntegrationsImplemention<any>
> = {
  file: LOCAL_STORAGE_INTEGRATION,
  s3: AWS_STORAGE_INTEGRATION,
  firebase: FIREBASE_STORAGE_INTEGRATION,
  minio: MINIO_STORAGE_INTEGRATION,
  cloudinary: CLOUDINARY_STORAGE_INTEGRATION,
  google: GOOGLE_STORAGE_INTEGRATION,
};
