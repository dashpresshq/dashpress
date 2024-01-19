import {
  credentialsApiService,
  CredentialsApiService,
} from "backend/integrations-configurations";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import {
  IIntegrationsList,
  IIntegrationImplementationList,
  ActionIntegrations,
} from "shared/types/actions";
import { sluggify } from "shared/lib/strings";
import {
  createKeyValueDomainPersistenceService,
  KeyValueStoreApiService,
} from "backend/lib/key-value";
import { IApplicationService } from "backend/types";
import { noop } from "shared/lib/noop";
import {
  formActionsApiService,
  FormActionsApiService,
} from "backend/form-actions/form-actions.service";
import { ACTION_INTEGRATIONS } from "./libs";

export class IntegrationsApiService implements IApplicationService {
  constructor(
    private readonly _activatedIntegrationsPersistenceService: KeyValueStoreApiService<
      ActionIntegrations[]
    >,
    private readonly _credentialsApiService: CredentialsApiService,
    private readonly _formActionsApiService: FormActionsApiService
  ) {}

  async bootstrap() {
    noop();
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

  async activateIntegration(
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

    const formActions = await this._formActionsApiService.getAllFormAction();

    for (const formAction of formActions) {
      if (formAction.integration === integration) {
        await this._formActionsApiService.deleteFormAction(formAction.id);
      }
    }
  }
}

const activatedIntegrationsPersistenceService =
  createKeyValueDomainPersistenceService<ActionIntegrations[]>(
    "activated-integrations"
  );

export const integrationsApiService = new IntegrationsApiService(
  activatedIntegrationsPersistenceService,
  credentialsApiService,
  formActionsApiService
);
