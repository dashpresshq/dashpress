import {
  appConstantsApiService,
  credentialsApiService,
  CredentialsApiService,
} from "backend/integrations-configurations";
import {
  IntegrationsConfigurationApiService,
  INTEGRATION_CONFIG_GROUP_DEMILITER,
} from "backend/integrations-configurations/services/_base";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError } from "backend/lib/errors";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import {
  IIntegrationsList,
  IActionInstance,
  IIntegrationImplementationList,
  ActionIntegrationKeys,
} from "shared/types/actions";
import { IAccountProfile } from "shared/types/user";
import { compileTemplateString } from "shared/lib/strings/templates";
import { sluggify } from "shared/lib/strings";
import { DataEventActions } from "shared/types/data";
import {
  createKeyValueDomainPersistenceService,
  KeyValueStoreApiService,
} from "backend/lib/key-value";
import { ACTION_INTEGRATIONS } from "./integrations";

export class ActionsApiService implements IApplicationService {
  constructor(
    private readonly _activatedIntegrationsPersistenceService: KeyValueStoreApiService<
      ActionIntegrationKeys[]
    >,
    private readonly _actionInstancesPersistenceService: AbstractConfigDataPersistenceService<IActionInstance>,
    private readonly _credentialsApiService: CredentialsApiService,
    private readonly _appConstantsApiService: IntegrationsConfigurationApiService
  ) {}

  async bootstrap() {
    await this._actionInstancesPersistenceService.setup();
  }

  async runAction(
    entity: string,
    dataEvent: DataEventActions,
    getData: () => Promise<Record<string, unknown>>,
    accountProfile: IAccountProfile
  ) {
    const instances = await this.listEntityActionInstances(entity);
    const actionsToRun = instances.filter(
      (action) => action.formAction === dataEvent
    );

    if (actionsToRun.length === 0) {
      return;
    }

    const data = await getData();

    for (const action of actionsToRun) {
      const { configuration, implementationKey, integrationKey } = action;

      const actionConfiguration = await this.getIntegrationCredentials(
        integrationKey
      );

      const connection = await ACTION_INTEGRATIONS[integrationKey].connect(
        actionConfiguration
      );

      const appConstants = Object.fromEntries(
        (await this._appConstantsApiService.list()).map(({ key, value }) => [
          key,
          value,
        ])
      );

      const credentials = Object.fromEntries(
        await Promise.all(
          (await this._credentialsApiService.list())
            .filter(
              ({ key }) => !key.includes(INTEGRATION_CONFIG_GROUP_DEMILITER)
            )
            .map(async ({ key, value }) => [
              key,
              await this._credentialsApiService.processDataAfterFetch(value),
            ])
        )
      );

      const compiledConfiguration = Object.fromEntries(
        Object.entries(configuration || {}).map(([key, value]) => [
          key,
          compileTemplateString(value, {
            data,
            [INTEGRATIONS_GROUP_CONFIG.constants.prefix]: appConstants,
            [INTEGRATIONS_GROUP_CONFIG.credentials.prefix]: credentials,
            auth: accountProfile,
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
      (activateIntegrationKey) =>
        activateIntegrationKey === action.integrationKey
    );

    if (!integrationKey) {
      throw new BadRequestError(
        `The integration for '${action.integrationKey}' has not yet been activated`
      );
    }

    await this._actionInstancesPersistenceService.createItem(instanceId, {
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

  listActionIntegrations(): IIntegrationsList[] {
    return Object.entries(ACTION_INTEGRATIONS).map(
      ([key, { title, description, configurationSchema }]) => ({
        description,
        title,
        key: key as ActionIntegrationKeys,
        configurationSchema,
      })
    );
  }

  listIntegrationImplementations(
    integrationKey: ActionIntegrationKeys
  ): IIntegrationImplementationList[] {
    return Object.entries(
      ACTION_INTEGRATIONS[integrationKey].performsImplementation
    ).map(([key, { configurationSchema, label }]) => ({
      label,
      key,
      configurationSchema,
    }));
  }

  async listActivatedActions(): Promise<ActionIntegrationKeys[]> {
    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    return [...activatedIntegrations, ActionIntegrationKeys.HTTP];
  }

  async activateAction(
    integrationKey: ActionIntegrationKeys,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integrationKey].configurationSchema,
      configuration
    );

    const credentialsGroupKey = this.makeCredentialsGroupKey(integrationKey);

    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    await this._activatedIntegrationsPersistenceService.persistItem([
      ...activatedIntegrations,
      integrationKey,
    ]);

    await this._credentialsApiService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(
          ACTION_INTEGRATIONS[integrationKey].configurationSchema
        ),
      },
      configuration
    );
  }

  private makeCredentialsGroupKey(integrationKey: ActionIntegrationKeys) {
    return sluggify(`ACTION__${integrationKey}`).toUpperCase();
  }

  async getIntegrationCredentials(
    integrationKey: ActionIntegrationKeys
  ): Promise<Record<string, unknown>> {
    if (integrationKey === ActionIntegrationKeys.HTTP) {
      return {};
    }

    return await this._credentialsApiService.useGroupValue({
      key: this.makeCredentialsGroupKey(integrationKey),
      fields: Object.keys(
        ACTION_INTEGRATIONS[integrationKey].configurationSchema
      ),
    });
  }

  async updateIntegrationConfig(
    integrationKey: ActionIntegrationKeys,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integrationKey].configurationSchema,
      configuration
    );

    await this._credentialsApiService.upsertGroup(
      {
        key: this.makeCredentialsGroupKey(integrationKey),
        fields: Object.keys(
          ACTION_INTEGRATIONS[integrationKey].configurationSchema
        ),
      },
      configuration
    );
  }

  async deactivateIntegration(
    integrationKey: ActionIntegrationKeys
  ): Promise<void> {
    await this._credentialsApiService.deleteGroup({
      key: this.makeCredentialsGroupKey(integrationKey),
      fields: Object.keys(
        ACTION_INTEGRATIONS[integrationKey].configurationSchema
      ),
    });

    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    await this._activatedIntegrationsPersistenceService.persistItem(
      activatedIntegrations.filter(
        (activatedIntegrationKey) => activatedIntegrationKey !== integrationKey
      )
    );

    const instances =
      await this._actionInstancesPersistenceService.getAllItems();

    for (const instance of instances) {
      if (instance.integrationKey === integrationKey) {
        await this._actionInstancesPersistenceService.removeItem(
          instance.instanceId
        );
      }
    }
  }
}

const activatedIntegrationsPersistenceService =
  createKeyValueDomainPersistenceService<ActionIntegrationKeys[]>(
    "activated-integrations"
  );

const actionInstancesPersistenceService =
  createConfigDomainPersistenceService<IActionInstance>("action-instances");

export const actionsApiService = new ActionsApiService(
  activatedIntegrationsPersistenceService,
  actionInstancesPersistenceService,
  credentialsApiService,
  appConstantsApiService
);
