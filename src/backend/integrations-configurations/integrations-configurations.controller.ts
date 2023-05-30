import { BadRequestError } from "backend/lib/errors";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { IKeyValue } from "frontend/views/settings/Variables/types";
import { credentialsApiService } from "./services/credentials.service";
import {
  appConstantsApiService,
  environmentVariablesApiService,
} from "./services/env-variable.service";
import {
  IntegrationsConfigurationApiService,
  INTEGRATION_CONFIG_GROUP_DEMILITER,
} from "./services/_base";

export class IntegrationsConfigurationApiController {
  constructor(
    private _appConstantsApiService: IntegrationsConfigurationApiService,
    private _environmentVariablesApiService: IntegrationsConfigurationApiService,
    private _credentialsApiService: IntegrationsConfigurationApiService
  ) {}

  async upsert(
    group: IntegrationsConfigurationGroup,
    key: string,
    { value }: { value: string }
  ) {
    if (this.isKeyAGroupKey(key)) {
      throw new BadRequestError(
        "Group keys can't be created or updated. They should be updated in the plugin settings"
      );
    }
    await this.getService(group).upsert(key, value);
  }

  async delete(group: IntegrationsConfigurationGroup, key: string) {
    if (this.isKeyAGroupKey(key)) {
      throw new BadRequestError(
        "Group keys can't be deleted. They will be removed when the plugin is removed"
      );
    }
    await this.getService(group).delete(key);
  }

  private async listUnGrouped(
    group: IntegrationsConfigurationGroup
  ): Promise<IKeyValue[]> {
    return (await this.getService(group).list()).filter(
      ({ key }) => !key.includes(INTEGRATION_CONFIG_GROUP_DEMILITER)
    );
  }

  async list(group: IntegrationsConfigurationGroup): Promise<IKeyValue[]> {
    const items = await this.listUnGrouped(group);
    if (group === IntegrationsConfigurationGroup.Credentials) {
      return items.map(({ key }) => ({ key, value: "***********" }));
    }
    return items;
  }

  async listWithRevealedValues(): Promise<IKeyValue[]> {
    const items = await this.listUnGrouped(
      IntegrationsConfigurationGroup.Credentials
    );
    return await Promise.all(
      items.map(async ({ key, value }) => ({
        key,
        value: await this._credentialsApiService.processDataAfterFetch(value),
      }))
    );
  }

  private isKeyAGroupKey(key: string) {
    return key.includes(IntegrationsConfigurationApiService.GROUP_DEMILITER);
  }

  private getService(group: IntegrationsConfigurationGroup) {
    const groupImplementation: Record<
      IntegrationsConfigurationGroup,
      IntegrationsConfigurationApiService
    > = {
      [IntegrationsConfigurationGroup.Constants]: this._appConstantsApiService,
      [IntegrationsConfigurationGroup.Env]:
        this._environmentVariablesApiService,
      [IntegrationsConfigurationGroup.Credentials]: this._credentialsApiService,
    };
    return groupImplementation[group];
  }
}

export const integrationsConfigurationApiController =
  new IntegrationsConfigurationApiController(
    appConstantsApiService,
    environmentVariablesApiService,
    credentialsApiService
  );
