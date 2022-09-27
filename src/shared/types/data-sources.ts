import { RDMSSources, IRDMSConnectionOptions } from "@hadmean/bacteria";

export type IDataSourceCredentials = IRDMSConnectionOptions;

const DATABASE_FIELDS: Array<keyof IDataSourceCredentials> = [
  "host",
  "user",
  "password",
  "database",
  "port",
  "ssl",
];

export const DATA_SOURCES_CONFIG: Record<
  string,
  {
    fields: Array<keyof IDataSourceCredentials>;
    port?: number;
    useConnectionString?: boolean;
  }
> = {
  [RDMSSources.Postgres]: {
    fields: DATABASE_FIELDS,
    port: 5432,
    useConnectionString: true,
  },
  [RDMSSources.MsSql]: {
    fields: DATABASE_FIELDS,
    port: 1433,
    useConnectionString: true,
  },
  [RDMSSources.MySql]: {
    fields: DATABASE_FIELDS,
    port: 3306,
    useConnectionString: true,
  },
  [RDMSSources.Sqlite]: {
    fields: ["filename"],
  },
};
