import { IDBCredentials } from "shared/types";
import { credentialsService, CredentialsService } from "./credentials.service";

export class CredentialController {
  constructor(private _credentialsService: CredentialsService) {}

  async upsert(domain: string, credentials: IDBCredentials) {
    await this._credentialsService.upsertDomainCredentials(domain, credentials);
  }

  async checkIfExists(domain: string): Promise<{ data: boolean }> {
    const credentials = await this._credentialsService.getDomainCredentials(
      domain
    );
    return { data: !!credentials };
  }

  async read(domain: string): Promise<IDBCredentials> {
    return await this._credentialsService.getDomainCredentials(domain);
  }
}

export const configurationController = new CredentialController(
  credentialsService
);
