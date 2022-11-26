import {
  credentialsService,
  CredentialsService,
} from "backend/integrations-configurations";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import {
  HTTP_ACTION_KEY,
  IActionsList,
  IActionsToTrigger,
  IActivatedAction,
} from "shared/types/actions";
import { ACTION_INTEGRATIONS } from ".";

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

  async runAction(entity: string, formAction: string) {
    const entityActions = await this.listEntityActions(entity);
    const actionsToRun = entityActions.filter(
      (action) => action.formAction === formAction
    );

    for (const action of actionsToRun) {
      const { configuration, performKey, activatedActionId } = action;
      // run triggerLogic triggerLogic
      const activatedAction =
        await this._activatedActionsPersistenceService.getItemOrFail(
          activatedActionId
        );
      if (!activatedAction) {
        return;
      }

      const actionConfiguration = await this.showActionConfig(
        activatedActionId
      );

      const connection =
        ACTION_INTEGRATIONS[activatedAction.integrationKey].connect(
          actionConfiguration
        );

      await ACTION_INTEGRATIONS[
        activatedAction.integrationKey
      ].performsImplementation[performKey].do(connection, configuration);
    }
  }

  async registerAction(
    entity: string,
    action: Omit<IActionsToTrigger, "triggerId">
  ) {
    const triggerId = nanoid();
    // TODO validate the schema before inserting

    await this._actionsToTriggerPersistenceService.upsertItem(triggerId, {
      ...action,
      entity,
      triggerId,
    });
  }

  async updateTriggerAction(triggerId: string, action: IActionsToTrigger) {
    // TODO validate the schema before inserting

    await this._actionsToTriggerPersistenceService.upsertItem(
      triggerId,
      action
    );
  }

  async deRegisterAction(triggerId: string) {
    await this._actionsToTriggerPersistenceService.removeItem(triggerId);
  }

  async listEntityActions(entity$1: string) {
    return (
      await this._actionsToTriggerPersistenceService.getAllItems()
    ).filter(({ entity }) => entity === entity$1);
  }

  async listIntegrationActions(integrationKey$1: string) {
    return (
      await this._actionsToTriggerPersistenceService.getAllItems()
    ).filter(({ integrationKey }) => integrationKey === integrationKey$1);
  }

  //

  listAllActions(): IActionsList[] {
    return Object.entries(ACTION_INTEGRATIONS).map(
      ([key, { title, description, configurationSchema }]) => ({
        description,
        title,
        key,
        configurationSchema,
      })
    );
  }

  async listActivatedActions(): Promise<IActivatedAction[]> {
    const activatedActions =
      await this._activatedActionsPersistenceService.getAllItems();
    return [
      ...activatedActions,
      {
        activationId: "DEFAULT",
        credentialsGroupKey: "DEFAULT",
        integrationKey: HTTP_ACTION_KEY,
      },
    ];
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

    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integrationKey].configurationSchema,
      configuration
    );

    await this._credentialsService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(
          ACTION_INTEGRATIONS[integrationKey].configurationSchema
        ),
      },
      configuration
    );
  }

  async showActionConfig(
    activationId: string
  ): Promise<Record<string, unknown>> {
    if (activationId === "DEFAULT") {
      return {};
    }
    const { credentialsGroupKey, integrationKey } =
      await this._activatedActionsPersistenceService.getItemOrFail(
        activationId
      );

    if (
      Object.keys(ACTION_INTEGRATIONS[integrationKey].configurationSchema)
        .length === 0
    ) {
      return {};
    }

    return await this._credentialsService.useGroupValue({
      key: credentialsGroupKey,
      fields: Object.keys(
        ACTION_INTEGRATIONS[integrationKey].configurationSchema
      ),
    });
  }

  async updateActionConfig(
    activationId: string,
    configuration: Record<string, string>
  ): Promise<void> {
    const { integrationKey, credentialsGroupKey } =
      await this._activatedActionsPersistenceService.getItemOrFail(
        activationId
      );

    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integrationKey].configurationSchema,
      configuration
    );

    await this._credentialsService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(
          ACTION_INTEGRATIONS[integrationKey].configurationSchema
        ),
      },
      configuration
    );
  }

  async deactivateAction(activationId: string): Promise<void> {
    const action = await this._activatedActionsPersistenceService.getItemOrFail(
      activationId
    );

    this._credentialsService.deleteGroup({
      key: action.credentialsGroupKey,
      fields: Object.keys(
        ACTION_INTEGRATIONS[action.integrationKey].configurationSchema
      ),
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
