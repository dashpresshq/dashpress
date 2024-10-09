import type { IStorageIntegrationsImplemention } from "../types";
import { AWS_STORAGE_INTEGRATION } from "./aws";
import { CLOUDINARY_STORAGE_INTEGRATION } from "./cloudinary";
import { GOOGLE_STORAGE_INTEGRATION } from "./google";
import { MINIO_STORAGE_INTEGRATION } from "./minio";
import { StorageIntegrations } from "./types";

export const STORAGE_INTEGRATIONS: Record<
  StorageIntegrations,
  IStorageIntegrationsImplemention<any>
> = {
  [StorageIntegrations.S3]: AWS_STORAGE_INTEGRATION,
  [StorageIntegrations.MINIO]: MINIO_STORAGE_INTEGRATION,
  [StorageIntegrations.CLOUDINARY]: CLOUDINARY_STORAGE_INTEGRATION,
  [StorageIntegrations.GOOGLE]: GOOGLE_STORAGE_INTEGRATION,
};
