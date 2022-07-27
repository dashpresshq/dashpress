import { credentialsService, CredentialsService } from "./credentials.service";
import { CREDENTIALS_DOMAINS, IDBCrendentials } from "./crendential.types";

export class CredentialController {
  constructor(private _credentialsService: CredentialsService) {}

  async setupDBCredentials(credentials: IDBCrendentials) {
    await this._credentialsService.upsertDomainCredentials(
      CREDENTIALS_DOMAINS.database,
      credentials
    );
  }

  async remove(domain: string) {
    await this._credentialsService.removeDomainCredentials(domain);
  }

  async upsert(domain: string, credentials: Record<string, unknown>) {
    await this._credentialsService.upsertDomainCredentials(domain, credentials);
  }

  async checkIfExists(domain: string): Promise<{ data: boolean }> {
    const credentials = await this._credentialsService.getDomainCredentials(
      domain
    );
    return { data: !!credentials };
  }

  async read(domain: string): Promise<Record<string, unknown>> {
    return await this._credentialsService.getDomainCredentials(domain);
  }
}

export const configurationController = new CredentialController(
  credentialsService
);
