import { IStorageIntegrationsImplemention } from "../types";
import { AWS_STORAGE_INTEGRATION } from "./aws";
import { CLOUDINARY_STORAGE_INTEGRATION } from "./cloudinary";
import { GOOGLE_STORAGE_INTEGRATION } from "./google";
import { StorageIntegrationKeys } from "./types";

export const STORAGE_INTEGRATIONS: Record<
  string,
  IStorageIntegrationsImplemention<any>
> = {
  [StorageIntegrationKeys.S3]: AWS_STORAGE_INTEGRATION,
  [StorageIntegrationKeys.CLOUDINARY]: CLOUDINARY_STORAGE_INTEGRATION,
  [StorageIntegrationKeys.GOOGLE]: GOOGLE_STORAGE_INTEGRATION,
};
