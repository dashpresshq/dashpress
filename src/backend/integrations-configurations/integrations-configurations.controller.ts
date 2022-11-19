import { BadRequestError } from "backend/lib/errors";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import {
  appConstantsService,
  environmentVariablesService,
} from "./services/env-variable.service";
import { IntegrationsConfigurationService } from "./services/_base";

export class IntegrationsConfigurationController {
  constructor(
    private _appConstantsService: IntegrationsConfigurationService,
    private _environmentVariablesService: IntegrationsConfigurationService
  ) {}

  async upsert(
    group: IntegrationsConfigurationGroup,
    key: string,
    { value }: { value: string }
  ) {
    if (
      !(await this.getService(group).hasKey(key)) &&
      this.isKeyAGroupKey(key)
    ) {
      throw new BadRequestError(
        "Group keys can't be created. They should be updated in the plugin settings"
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

  async list(group: IntegrationsConfigurationGroup) {
    return await this.getService(group).list();
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
    };
    return groupImplementation[group];
  }
}

export const integrationsConfigurationController =
  new IntegrationsConfigurationController(
    appConstantsService,
    environmentVariablesService
  );
