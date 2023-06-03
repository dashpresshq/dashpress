import { PORTAL_NPM_PACKAGES_CONFIG, PortalNpmPackageDomain } from "./portal";
import { INpmPackagesConfig } from "./types";

export enum BaseNpmPackageDomain {
  FileUpload = "file-upload", // after any file upload is activated
  Mail = "mail", // after mail is activate
  Redis = "redis", // if redis is configured
  // After the credentials setup
  Postgres = "postgres",
  SQlite = "sqlite",
  MySQl = "mysql",
  MsSQL = "mssql",
  Oracle = "oracle",
}

export const DatabaseNpmPackageDomains = [
  BaseNpmPackageDomain.Postgres,
  BaseNpmPackageDomain.MySQl,
  BaseNpmPackageDomain.SQlite,
  BaseNpmPackageDomain.MsSQL,
  BaseNpmPackageDomain.Oracle,
];

export type NpmPackageDomain = BaseNpmPackageDomain | PortalNpmPackageDomain;

const BASE_NPM_PACKAGES_CONFIG: Record<
  BaseNpmPackageDomain,
  INpmPackagesConfig
> = {
  [BaseNpmPackageDomain.FileUpload]: {
    packages: [
      {
        package: "multer",
        version: "^1.4.5-lts.1",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.Mail]: {
    packages: [
      {
        package: "nodemailer",
        version: "^6.8.0",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.Redis]: {
    packages: [
      {
        package: "redis",
        version: "^4.4.0",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.Postgres]: {
    packages: [
      {
        package: "pg",
        version: "^8.7.3",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.SQlite]: {
    packages: [
      {
        package: "sqlite3",
        version: "^5.0.8",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.MySQl]: {
    packages: [
      {
        package: "mysql2",
        version: "^2.3.3",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.MsSQL]: {
    packages: [
      {
        package: "mssql",
        version: "^8.1.2",
      },
    ],
    shouldInstall: async () => true,
  },
  [BaseNpmPackageDomain.Oracle]: {
    packages: [
      {
        package: "oracledb",
        version: "^5.4.0",
      },
    ],
    shouldInstall: async () => true,
  },
};

export const NPM_PACKAGES_CONFIG: Record<NpmPackageDomain, INpmPackagesConfig> =
  {
    ...BASE_NPM_PACKAGES_CONFIG,
    ...PORTAL_NPM_PACKAGES_CONFIG,
  };
