import {
  credentialsService,
  CredentialsService,
} from "backend/integrations-configurations";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import noop from "lodash/noop";
import { ACTION_INTEGRATIONS } from ".";

export interface IActivatedAction {
  activationId: string;
  credentialsGroupKey: string;
}

export interface IActionsToTrigger {
  triggerId: string;
  activatedActionId: string;
  entity: string;
  formAction: "create" | "update";
  configuration: Record<string, string>;
}

export class ActionsService implements IApplicationService {
  constructor(
    private readonly _activatedActionsPersistenceService: AbstractConfigDataPersistenceService<IActivatedAction>,
    private readonly _actionsToTriggerPersistenceService: AbstractConfigDataPersistenceService<IActionsToTrigger>,
    private readonly _credentialsService: CredentialsService
  ) {}

  async bootstrap() {
    await this._activatedActionsPersistenceService.setup();
    await this._actionsToTriggerPersistenceService.setup();
    noop(this._credentialsService);
  }

  // perform(entity: string, formAction: string) {
  //   //
  // }

  listAllActions(): Array<{ title: string; description: string }> {
    return Object.values(ACTION_INTEGRATIONS).map(({ title, description }) => ({
      description,
      title,
    }));
  }

  // async listActiveActions(): Promise<{ title: string; description: string }[]> {
  //   return this.listAllActions().filter();
  // }

  // async deactivateAction(actionKey: string): Promise<void> {}
}

const activatedActionsPersistenceService =
  createConfigDomainPersistenceService<IActivatedAction>("activated_actions");

const actionsToTriggerPersistenceService =
  createConfigDomainPersistenceService<IActionsToTrigger>("trigger_actions");

export const actionsService = new ActionsService(
  activatedActionsPersistenceService,
  actionsToTriggerPersistenceService,
  credentialsService
);
