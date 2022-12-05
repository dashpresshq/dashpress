import {
  appConstantsService,
  credentialsService,
  CredentialsService,
} from "backend/integrations-configurations";
import { IntegrationsConfigurationService } from "backend/integrations-configurations/services/_base";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError } from "backend/lib/errors";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import { IApplicationService } from "backend/types";
import { INTEGRATIONS_GROUP_CONFIG } from "frontend/views/settings/Configurations/constants";
import { nanoid } from "nanoid";
import { TemplateService } from "shared/lib/templates";
import {
  HTTP_INTEGRATION_KEY,
  IIntegrationsList,
  IActionInstance,
  IActivatedAction,
  IIntegrationImplementationList,
  HTTP_ACTIVATION_ID,
} from "shared/types/actions";
import { ACTION_INTEGRATIONS } from "./integrations";

export class ActionsService implements IApplicationService {
  constructor(
    private readonly _activatedActionsPersistenceService: AbstractConfigDataPersistenceService<IActivatedAction>,
    private readonly _actionInstancesPersistenceService: AbstractConfigDataPersistenceService<IActionInstance>,
    private readonly _credentialsService: CredentialsService,
    private readonly _appConstantsService: IntegrationsConfigurationService
  ) {}

  async bootstrap() {
    await this._activatedActionsPersistenceService.setup();
    await this._actionInstancesPersistenceService.setup();
  }

  async runAction(
    entity: string,
    formAction: string,
    getData: () => Promise<Record<string, unknown>>
  ) {
    const instances = await this.listEntityActionInstances(entity);
    const actionsToRun = instances.filter(
      (action) => action.formAction === formAction
    );

    if (actionsToRun.length === 0) {
      return;
    }

    const data = await getData();

    for (const action of actionsToRun) {
      const { configuration, implementationKey, activatedActionId } = action;
      // run triggerLogic triggerLogic

      const integrationKey = await this.getIntegrationKeyFromActivatedActionId(
        activatedActionId
      );

      const actionConfiguration = await this.showActionConfig(
        activatedActionId
      );

      const connection =
        ACTION_INTEGRATIONS[integrationKey].connect(actionConfiguration);

      const appConstants = Object.fromEntries(
        (await this._appConstantsService.list()).map(({ key, value }) => [
          key,
          value,
        ])
      );

      const compiledConfiguration = Object.fromEntries(
        Object.entries(configuration || {}).map(([key, value]) => [
          key,
          TemplateService.compile(value, {
            data,
            [INTEGRATIONS_GROUP_CONFIG.constants.prefix]: appConstants,
            auth: "TODO",
          }),
        ])
      );

      await ACTION_INTEGRATIONS[integrationKey].performsImplementation[
        implementationKey
      ].do(connection, compiledConfiguration);
    }
  }

  async instantiateAction(action: Omit<IActionInstance, "instanceId">) {
    const instanceId = nanoid();
    const activatedActions = await this.listActivatedActions();

    const integrationKey = activatedActions.find(
      ({ activationId }) => action.activatedActionId === activationId
    )?.integrationKey;

    if (!integrationKey) {
      throw new BadRequestError(
        `Integration Key not found for activatedActionId '${action.activatedActionId}'`
      );
    }

    await this._actionInstancesPersistenceService.upsertItem(instanceId, {
      ...action,
      integrationKey,
      instanceId,
    });
  }

  async updateActionInstance(
    instanceId: string,
    instance: Omit<IActionInstance, "instanceId">
  ) {
    await this._actionInstancesPersistenceService.upsertItem(instanceId, {
      ...instance,
      instanceId,
    });
  }

  async deleteActionInstance(instanceId: string) {
    await this._actionInstancesPersistenceService.removeItem(instanceId);
  }

  async listEntityActionInstances(entity$1: string) {
    return (await this._actionInstancesPersistenceService.getAllItems()).filter(
      ({ entity }) => entity === entity$1
    );
  }

  async listIntegrationActions(integrationKey$1: string) {
    return (await this._actionInstancesPersistenceService.getAllItems()).filter(
      ({ integrationKey }) => integrationKey === integrationKey$1
    );
  }

  listIntegrations(): IIntegrationsList[] {
    return Object.entries(ACTION_INTEGRATIONS).map(
      ([key, { title, description, configurationSchema }]) => ({
        description,
        title,
        key,
        configurationSchema,
      })
    );
  }

  listIntegrationImplementations(
    integrationKey: string
  ): IIntegrationImplementationList[] {
    return Object.entries(
      ACTION_INTEGRATIONS[integrationKey].performsImplementation
    ).map(([key, { configurationSchema, label }]) => ({
      label,
      key,
      configurationSchema,
    }));
  }

  async listActivatedActions(): Promise<IActivatedAction[]> {
    const activatedActions =
      await this._activatedActionsPersistenceService.getAllItems();
    return [
      ...activatedActions,
      {
        activationId: HTTP_ACTIVATION_ID,
        credentialsGroupKey: "none-existent",
        integrationKey: HTTP_INTEGRATION_KEY,
      },
    ];
  }

  async activateAction(
    integrationKey: string,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integrationKey].configurationSchema,
      configuration
    );

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
        fields: Object.keys(
          ACTION_INTEGRATIONS[integrationKey].configurationSchema
        ),
      },
      configuration
    );
  }

  private async getIntegrationKeyFromActivatedActionId(
    activatedActionId: string
  ): Promise<string> {
    if (activatedActionId === HTTP_ACTIVATION_ID) {
      return HTTP_INTEGRATION_KEY;
    }
    const activatedAction =
      await this._activatedActionsPersistenceService.getItemOrFail(
        activatedActionId
      );
    return activatedAction.integrationKey;
  }

  async showActionConfig(
    activationId: string
  ): Promise<Record<string, unknown>> {
    if (activationId === HTTP_ACTIVATION_ID) {
      return {};
    }
    const { credentialsGroupKey, integrationKey } =
      await this._activatedActionsPersistenceService.getItemOrFail(
        activationId
      );

    return await this._credentialsService.useGroupValue({
      key: credentialsGroupKey,
      fields: Object.keys(
        ACTION_INTEGRATIONS[integrationKey].configurationSchema
      ),
    });
  }

  // TODO require password to update action config
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

    const instances =
      await this._actionInstancesPersistenceService.getAllItems();

    for (const instance of instances) {
      if (instance.activatedActionId === activationId) {
        await this._actionInstancesPersistenceService.removeItem(
          instance.instanceId
        );
      }
    }
  }
}

const activatedActionsPersistenceService =
  createConfigDomainPersistenceService<IActivatedAction>("activated_actions");

const actionInstancesPersistenceService =
  createConfigDomainPersistenceService<IActionInstance>("action_instances");

export const actionsService = new ActionsService(
  activatedActionsPersistenceService,
  actionInstancesPersistenceService,
  credentialsService,
  appConstantsService
);
