import { BadRequestError } from "backend/lib/errors";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { credentialsService } from "./services/credentials.service";
import {
  appConstantsService,
  environmentVariablesService,
} from "./services/env-variable.service";
import {
  IntegrationsConfigurationService,
  INTEGRATION_CONFIG_GROUP_DEMILITER,
} from "./services/_base";

export class IntegrationsConfigurationController {
  constructor(
    private _appConstantsService: IntegrationsConfigurationService,
    private _environmentVariablesService: IntegrationsConfigurationService,
    private _credentialsService: IntegrationsConfigurationService
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
  ): Promise<{ key: string; value: string }[]> {
    return (await this.getService(group).list()).filter(
      ({ key }) => !key.includes(INTEGRATION_CONFIG_GROUP_DEMILITER)
    );
  }

  async list(
    group: IntegrationsConfigurationGroup
  ): Promise<{ key: string; value: string }[]> {
    const items = await this.listUnGrouped(group);
    if (group === IntegrationsConfigurationGroup.Credentials) {
      return items.map(({ key }) => ({ key, value: "***********" }));
    }
    return items;
  }

  async listWithRevealedValues(): Promise<{ key: string; value: string }[]> {
    const items = await this.listUnGrouped(
      IntegrationsConfigurationGroup.Credentials
    );
    return await Promise.all(
      items.map(async ({ key, value }) => ({
        key,
        value: await this._credentialsService.processDataAfterFetch(value),
      }))
    );
  }

  private isKeyAGroupKey(key: string) {
    return key.includes(IntegrationsConfigurationService.GROUP_DEMILITER);
  }

  private getService(group: IntegrationsConfigurationGroup) {
    const groupImplementation: Record<
      IntegrationsConfigurationGroup,
      IntegrationsConfigurationService
    > = {
      [IntegrationsConfigurationGroup.Constants]: this._appConstantsService,
      [IntegrationsConfigurationGroup.Env]: this._environmentVariablesService,
      [IntegrationsConfigurationGroup.Credentials]: this._credentialsService,
    };
    return groupImplementation[group];
  }
}

export const integrationsConfigurationController =
  new IntegrationsConfigurationController(
    appConstantsService,
    environmentVariablesService,
    credentialsService
  );
