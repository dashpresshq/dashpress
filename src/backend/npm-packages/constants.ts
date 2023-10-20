import {
  ConfigKeys,
  configApiService,
} from "backend/lib/config/config.service";
import { CacheAdaptorTypes } from "backend/lib/cache/types";
import { credentialsApiService } from "backend/integrations-configurations";
import { DATABASE_CREDENTIAL_GROUP } from "backend/data/fields";
import { IDataSourceCredentials } from "shared/types/data-sources";
import { RDMSSources } from "@dashpress/bacteria";
import { ACTION_INTEGRATIONS } from "backend/actions/integrations";
import { ActionIntegrationKeys } from "shared/types/actions";
import { PORTAL_NPM_PACKAGES_CONFIG, PortalNpmPackageDomain } from "./portal";
import { INpmPackagesConfig } from "./types";

enum BaseNpmPackageDomain {
  FileUpload = "file-upload", // after any file upload is activated
  Mail = "mail",
  Redis = "redis",
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

const shouldDatabaseNpmPackageBeInstalled = async (
  rdbmsSource: RDMSSources
) => {
  const hasDbCredentials = await credentialsApiService.hasGroupKey(
    DATABASE_CREDENTIAL_GROUP
  );

  if (!hasDbCredentials) {
    return true;
  }

  const dbCredentials =
    await credentialsApiService.useGroupValue<IDataSourceCredentials>(
      DATABASE_CREDENTIAL_GROUP
    );

  return dbCredentials.dataSourceType === rdbmsSource;
};

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
    shouldInstall: async () =>
      await credentialsApiService.hasGroupKey({
        key: ACTION_INTEGRATIONS[ActionIntegrationKeys.SMTP].credentialsKey,
        fields: Object.keys(
          ACTION_INTEGRATIONS[ActionIntegrationKeys.SMTP].configurationSchema
        ),
      }),
  },
  [BaseNpmPackageDomain.Redis]: {
    packages: [
      {
        package: "redis",
        version: "^4.4.0",
      },
    ],
    shouldInstall: async () => {
      return (
        configApiService.getConfigValue<CacheAdaptorTypes>(
          ConfigKeys.CACHE_ADAPTOR
        ) === CacheAdaptorTypes.Redis
      );
    },
  },
  [BaseNpmPackageDomain.Postgres]: {
    packages: [
      {
        package: "pg",
        version: "^8.7.3",
      },
    ],
    shouldInstall: async () =>
      await shouldDatabaseNpmPackageBeInstalled(RDMSSources.Postgres),
  },
  [BaseNpmPackageDomain.SQlite]: {
    packages: [
      {
        package: "sqlite3",
        version: "^5.0.8",
      },
    ],
    shouldInstall: async () =>
      await shouldDatabaseNpmPackageBeInstalled(RDMSSources.Sqlite),
  },
  [BaseNpmPackageDomain.MySQl]: {
    packages: [
      {
        package: "mysql2",
        version: "^2.3.3",
      },
    ],
    shouldInstall: async () =>
      await shouldDatabaseNpmPackageBeInstalled(RDMSSources.MySql),
  },
  [BaseNpmPackageDomain.MsSQL]: {
    packages: [
      {
        package: "mssql",
        version: "^8.1.2",
      },
    ],
    shouldInstall: async () =>
      await shouldDatabaseNpmPackageBeInstalled(RDMSSources.MsSql),
  },
  [BaseNpmPackageDomain.Oracle]: {
    packages: [
      {
        package: "oracledb",
        version: "^5.4.0",
      },
    ],
    shouldInstall: async () => false,
  },
};

export const NPM_PACKAGES_CONFIG: Record<NpmPackageDomain, INpmPackagesConfig> =
  {
    ...BASE_NPM_PACKAGES_CONFIG,
    ...PORTAL_NPM_PACKAGES_CONFIG,
  };
