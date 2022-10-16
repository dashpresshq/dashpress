import { credentialsService } from "./services/credentials.service";
import {
  appConstantsService,
  environmentVariablesService,
} from "./services/env-variable.service";
import { IntegrationsConfigurationService } from "./services/_base";

enum IntegrationsConfigurationGroup {
  Credentials = "credentials",
  Env = "env",
  AppConstants = "app-constant",
}

export class IntegrationsConfigurationController {
  constructor(
    private _credentialsService: IntegrationsConfigurationService,
    private _appConstantsService: IntegrationsConfigurationService,
    private _environmentVariablesService: IntegrationsConfigurationService
  ) {}

  private getService(group: IntegrationsConfigurationGroup) {
    const groupImplementation: Record<
      IntegrationsConfigurationGroup,
      IntegrationsConfigurationService
    > = {
      "app-constant": this._appConstantsService,
      env: this._environmentVariablesService,
      credentials: this._credentialsService,
    };
    return groupImplementation[group];
  }

  async upsert(key: string, value: string) {
    // Check if key exist as we need create/update
    // Can't create configuration key with `___`
    await this._credentialsService.upsert(key, value);
  }

  async delete(group: IntegrationsConfigurationGroup, key: string) {
    if (this.isKeyAGroupKey(key)) {
      throw new Error(
        "Group keys can't be deleted. They will be removed when the plugin is removed"
      );
    }
    await this.getService(group).delete(key);
  }

  private isKeyAGroupKey(key: string) {
    return key.includes(IntegrationsConfigurationService.GROUP_DEMILITER);
  }

  async list() {
    // return "XXXXX" for keys
    // Order by key
    return [];
  }
}

export const integrationsConfigurationController =
  new IntegrationsConfigurationController(
    credentialsService,
    appConstantsService,
    environmentVariablesService
  );
