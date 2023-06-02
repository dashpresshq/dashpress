import { PORTAL_NPM_PACKAGES_CONFIG, PortalNpmPackageDomain } from "./portal";

enum BaseNpmPackageDomain {
  FileUpload = "file-upload", // after any file upload is activated
  Mail = "mail", // after mail is activate
  Redis = "redis", // if redis is configured
  // After the crednetials setup
  Postgres = "postgres",
  SQlite = "sqlite",
  MySQl = "mysql",
  MsSQL = "mssql",
  Oracle = "oracle",
}

export type NpmPackageDomain = BaseNpmPackageDomain | PortalNpmPackageDomain;

const BASE_NPM_PACKAGES_CONFIG: Record<
  BaseNpmPackageDomain,
  Record<string, string>
> = {
  [BaseNpmPackageDomain.FileUpload]: {
    multer: "^1.4.5-lts.1",
  },
  [BaseNpmPackageDomain.Mail]: {
    nodemailer: "^6.8.0",
  },
  [BaseNpmPackageDomain.Redis]: {
    redis: "^4.4.0",
  },
  [BaseNpmPackageDomain.Postgres]: {
    pg: "^8.7.3",
  },
  [BaseNpmPackageDomain.SQlite]: {
    sqlite3: "^5.0.8",
  },
  [BaseNpmPackageDomain.MySQl]: {
    mysql2: "^2.3.3",
  },
  [BaseNpmPackageDomain.MsSQL]: {
    mssql: "^8.1.2",
  },
  [BaseNpmPackageDomain.Oracle]: {
    oracledb: "^5.4.0",
  },
};

export const NPM_PACKAGES_CONFIG: Record<
  NpmPackageDomain,
  Record<string, string>
> = {
  ...BASE_NPM_PACKAGES_CONFIG,
  ...PORTAL_NPM_PACKAGES_CONFIG,
};
