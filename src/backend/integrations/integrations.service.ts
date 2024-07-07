import type { FormActionsApiService } from "@/backend/form-actions/form-actions.service";
import { formActionsApiService } from "@/backend/form-actions/form-actions.service";
import type { CredentialsApiService } from "@/backend/integrations-configurations";
import { credentialsApiService } from "@/backend/integrations-configurations";
import { validateSchemaRequestBody } from "@/backend/lib/errors/validate-schema-request-input";
import type { KeyValueStoreApiService } from "@/backend/lib/key-value";
import { createKeyValueDomainPersistenceService } from "@/backend/lib/key-value";
import {
  typescriptSafeObjectDotEntries,
  typescriptSafeObjectDotKeys,
} from "@/shared/lib/objects";
import { sluggify } from "@/shared/lib/strings";
import type {
  IIntegrationImplementationList,
  IIntegrationsList,
} from "@/shared/types/actions";
import { ActionIntegrations } from "@/shared/types/actions";

import { ACTION_INTEGRATIONS } from "./libs";

export class IntegrationsApiService {
  constructor(
    private readonly _activatedIntegrationsPersistenceService: KeyValueStoreApiService<
      ActionIntegrations[]
    >,
    private readonly _credentialsApiService: CredentialsApiService,
    private readonly _formActionsApiService: FormActionsApiService
  ) {}

  listActionIntegrations(): IIntegrationsList[] {
    return typescriptSafeObjectDotEntries(ACTION_INTEGRATIONS).map(
      ([key, { title, description, configurationSchema }]) => ({
        description,
        title,
        key,
        configurationSchema,
      })
    );
  }

  listIntegrationImplementations(
    integration: ActionIntegrations
  ): IIntegrationImplementationList[] {
    return typescriptSafeObjectDotEntries(
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
        fields: typescriptSafeObjectDotKeys(
          ACTION_INTEGRATIONS[integration].configurationSchema
        ) as string[],
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
      fields: typescriptSafeObjectDotKeys(
        ACTION_INTEGRATIONS[integration].configurationSchema
      ) as string[],
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
        fields: typescriptSafeObjectDotKeys(
          ACTION_INTEGRATIONS[integration].configurationSchema
        ) as string[],
      },
      configuration
    );
  }

  async deactivateIntegration(integration: ActionIntegrations): Promise<void> {
    await this._credentialsApiService.deleteGroup({
      key: this.makeCredentialsGroupKey(integration),
      fields: typescriptSafeObjectDotKeys(
        ACTION_INTEGRATIONS[integration].configurationSchema
      ) as string[],
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
