export enum CredentialsGroup {
  MAIL = "mail",
  DATABASE = "database",
}

export const CREDENTIALS_GROUP: Record<CredentialsGroup, string[]> = {
  mail: ["host", "user", "password", "ssl"],
  database: [
    "dataSourceType",
    "port",
    "host",
    "user",
    "connectionString",
    "database",
    "password",
  ],
};
