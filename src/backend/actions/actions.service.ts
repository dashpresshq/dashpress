import {
  credentialsService,
  CredentialsService,
} from "backend/integrations-configurations";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { ACTION_INTEGRATIONS } from ".";
import { IActionIntegrationsImplemention } from "./types";

interface IActivatedAction {
  activationId: string;
  integrationKey: string;
  credentialsGroupKey: string;
}

interface IActionsToTrigger {
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
  }

  // perform(entity: string, formAction: string) {
  //   //
  // }

  listAllActions(): Array<
    { key: string } & Pick<
      IActionIntegrationsImplemention,
      "title" | "description" | "configurationSchema"
    >
  > {
    return Object.entries(ACTION_INTEGRATIONS).map(
      ([key, { title, description, configurationSchema }]) => ({
        description,
        title,
        key,
        configurationSchema,
      })
    );
  }

  async listActivedActions(): Promise<IActivatedAction[]> {
    return await this._activatedActionsPersistenceService.getAllItems();
  }

  async activateAction(
    integrationKey: string,
    configuration: Record<string, string>
  ): Promise<void> {
    const activationId = nanoid();
    const credentialsGroupKey = integrationKey.toUpperCase();
    await this._activatedActionsPersistenceService.upsertItem(activationId, {
      activationId,
      integrationKey,
      credentialsGroupKey,
    });
    await this._credentialsService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(ACTION_INTEGRATIONS[integrationKey]),
      },
      configuration
    );
  }

  async updateActionConfig(
    activationId: string,
    configuration: Record<string, string>
  ): Promise<void> {
    const { integrationKey, credentialsGroupKey } =
      await this._activatedActionsPersistenceService.getItem(activationId);
    await this._credentialsService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(ACTION_INTEGRATIONS[integrationKey]),
      },
      configuration
    );
  }

  async deactivateAction(activationId: string): Promise<void> {
    const action = await this._activatedActionsPersistenceService.getItem(
      activationId
    );

    this._credentialsService.deleteGroup({
      key: action.credentialsGroupKey,
      fields: Object.keys(ACTION_INTEGRATIONS[action.integrationKey]),
    });

    await this._activatedActionsPersistenceService.removeItem(activationId);

    const triggers =
      await this._actionsToTriggerPersistenceService.getAllItems();

    for (const trigger of triggers) {
      if (trigger.activatedActionId === activationId) {
        await this._actionsToTriggerPersistenceService.removeItem(
          trigger.triggerId
        );
      }
    }
  }
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
