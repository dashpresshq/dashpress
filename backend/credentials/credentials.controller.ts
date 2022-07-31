import { IDBCrendentials } from "shared/types";
import { credentialsService, CredentialsService } from "./credentials.service";

export class CredentialController {
  constructor(private _credentialsService: CredentialsService) {}

  async remove(domain: string) {
    await this._credentialsService.removeDomainCredentials(domain);
  }

  async upsert(domain: string, credentials: IDBCrendentials) {
    await this._credentialsService.upsertDomainCredentials(domain, credentials);
  }

  async checkIfExists(domain: string): Promise<{ data: boolean }> {
    const credentials = await this._credentialsService.getDomainCredentials(
      domain
    );
    return { data: !!credentials };
  }

  async read(domain: string): Promise<IDBCrendentials> {
    return await this._credentialsService.getDomainCredentials(domain);
  }
}

export const configurationController = new CredentialController(
  credentialsService
);
