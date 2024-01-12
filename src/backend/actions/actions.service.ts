import {
  credentialsApiService,
  CredentialsApiService,
} from "backend/integrations-configurations";
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
  ActionIntegrations,
} from "shared/types/actions";
import { IAccountProfile } from "shared/types/user";
import { compileTemplateString } from "shared/lib/strings/templates";
import { sluggify } from "shared/lib/strings";
import { DataEventActions } from "shared/types/data";
import {
  createKeyValueDomainPersistenceService,
  KeyValueStoreApiService,
} from "backend/lib/key-value";
import { getAppCredentialsAndConstants } from "backend/integrations-configurations/utils";
import { ACTION_INTEGRATIONS } from "./integrations";

export class ActionsApiService implements IApplicationService {
  constructor(
    private readonly _activatedIntegrationsPersistenceService: KeyValueStoreApiService<
      ActionIntegrations[]
    >,
    private readonly _actionInstancesPersistenceService: AbstractConfigDataPersistenceService<IActionInstance>,
    private readonly _credentialsApiService: CredentialsApiService
  ) {}

  async bootstrap() {
    await this._actionInstancesPersistenceService.setup();
  }

  async runAction(
    entity: string,
    dataEventAction: DataEventActions,
    getData: () => Promise<Record<string, unknown>>,
    accountProfile: IAccountProfile
  ) {
    const instances = await this.listEntityActionInstances(entity);
    const actionsToRun = instances.filter(
      (action) => action.trigger === dataEventAction
    );

    if (actionsToRun.length === 0) {
      return;
    }

    const data = await getData();

    const { appConstants, credentials } = await getAppCredentialsAndConstants();

    for (const actionToRun of actionsToRun) {
      const { configuration, action, integration } = actionToRun;

      const actionConfiguration = await this.getIntegrationCredentials(
        integration
      );

      const connection = await ACTION_INTEGRATIONS[integration].connect(
        actionConfiguration
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

      await ACTION_INTEGRATIONS[integration].performsImplementation[action].do(
        connection,
        compiledConfiguration
      );
    }
  }

  async instantiateAction(action: Omit<IActionInstance, "instanceId">) {
    const instanceId = nanoid();
    const activatedIntegrations = await this.listActivatedIntegrations();

    const integration = activatedIntegrations.find(
      (activatedIntegration) => activatedIntegration === action.integration
    );

    if (!integration) {
      throw new BadRequestError(
        `The integration for '${action.integration}' has not yet been activated`
      );
    }

    await this._actionInstancesPersistenceService.createItem(instanceId, {
      ...action,
      integration,
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
        key: key as ActionIntegrations,
        configurationSchema,
      })
    );
  }

  listIntegrationImplementations(
    integration: ActionIntegrations
  ): IIntegrationImplementationList[] {
    return Object.entries(
      ACTION_INTEGRATIONS[integration].performsImplementation
    ).map(([key, { configurationSchema, label }]) => ({
      label,
      key,
      configurationSchema,
    }));
  }

  async listActivatedIntegrations(): Promise<ActionIntegrations[]> {
    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    return [...activatedIntegrations, ActionIntegrations.HTTP];
  }

  async activateAction(
    integration: ActionIntegrations,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integration].configurationSchema,
      configuration
    );

    const credentialsGroupKey = this.makeCredentialsGroupKey(integration);

    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    await this._activatedIntegrationsPersistenceService.persistItem([
      ...activatedIntegrations,
      integration,
    ]);

    await this._credentialsApiService.upsertGroup(
      {
        key: credentialsGroupKey,
        fields: Object.keys(
          ACTION_INTEGRATIONS[integration].configurationSchema
        ),
      },
      configuration
    );
  }

  private makeCredentialsGroupKey(integration: ActionIntegrations) {
    return sluggify(`ACTION__${integration}`).toUpperCase();
  }

  async getIntegrationCredentials(
    integration: ActionIntegrations
  ): Promise<Record<string, unknown>> {
    if (integration === ActionIntegrations.HTTP) {
      return {};
    }

    return await this._credentialsApiService.useGroupValue({
      key: this.makeCredentialsGroupKey(integration),
      fields: Object.keys(ACTION_INTEGRATIONS[integration].configurationSchema),
    });
  }

  async updateIntegrationConfig(
    integration: ActionIntegrations,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      ACTION_INTEGRATIONS[integration].configurationSchema,
      configuration
    );

    await this._credentialsApiService.upsertGroup(
      {
        key: this.makeCredentialsGroupKey(integration),
        fields: Object.keys(
          ACTION_INTEGRATIONS[integration].configurationSchema
        ),
      },
      configuration
    );
  }

  async deactivateIntegration(integration: ActionIntegrations): Promise<void> {
    await this._credentialsApiService.deleteGroup({
      key: this.makeCredentialsGroupKey(integration),
      fields: Object.keys(ACTION_INTEGRATIONS[integration].configurationSchema),
    });

    const activatedIntegrations =
      (await this._activatedIntegrationsPersistenceService.getItem()) || [];

    await this._activatedIntegrationsPersistenceService.persistItem(
      activatedIntegrations.filter(
        (activatedIntegration) => activatedIntegration !== integration
      )
    );

    const instances =
      await this._actionInstancesPersistenceService.getAllItems();

    for (const instance of instances) {
      if (instance.integration === integration) {
        await this._actionInstancesPersistenceService.removeItem(
          instance.instanceId
        );
      }
    }
  }
}

const activatedIntegrationsPersistenceService =
  createKeyValueDomainPersistenceService<ActionIntegrations[]>(
    "activated-integrations"
  );

const actionInstancesPersistenceService =
  createConfigDomainPersistenceService<IActionInstance>("action-instances");

export const actionsApiService = new ActionsApiService(
  activatedIntegrationsPersistenceService,
  actionInstancesPersistenceService,
  credentialsApiService
);
