import { CredentialsService } from "backend/integrations-configurations";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import { ACTION_INTEGRATIONS } from ".";

export interface IActivatedAction {
  id: string;
  credentialsGroupKey: string;
}

export interface IConfiguredActions {
  id: string;
  entity: string;
  formAction: "create" | "update";
  configuration: Record<string, string>;
}

export class ActionsService implements IApplicationService {
  constructor(
    private readonly _activatedActionsPersistenceService: AbstractConfigDataPersistenceService<IActivatedAction>,
    private readonly _credentialsService: CredentialsService
  ) {}

  async bootstrap() {
    await this._activatedActionsPersistenceService.setup();
  }

  perform(entity: string, formAction: string) {
    //
  }

  listAllActions(): Array<{ title: string; description: string }> {
    return Object.values(ACTION_INTEGRATIONS).map(({ title, description }) => ({
      description,
      title,
    }));
  }

  async listActiveActions(): Promise<{ title: string; description: string }[]> {
    return this.listAllActions().filter();
  }

  async deactivateAction(actionKey: string): Promise<void> {}
}

const activatedActionsPersistenceService =
  createConfigDomainPersistenceService<IActivatedAction>("activated_actions");

const configuredActionsPersistenceService =
  createConfigDomainPersistenceService<IActivatedAction>("configured_actions");

export const actionsService = new ActionsService(
  activatedActionsPersistenceService,
  credentialsService
);
