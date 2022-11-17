import { IGroupCredential } from "backend/integrations-configurations/types";

export const DATABASE_CREDENTIAL_GROUP: IGroupCredential = {
  key: "DATABASE",
  fields: [
    "dataSourceType",
    "port",
    "host",
    "user",
    "connectionString",
    "database",
    "password",
  ],
};
