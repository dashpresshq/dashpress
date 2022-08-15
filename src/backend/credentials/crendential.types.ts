export interface IMailCredentials {
  host: string;
  user: string;
  password: string;
  ssl: boolean;
}

export const CREDENTIALS_DOMAINS = { database: "database" };
