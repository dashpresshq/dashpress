import { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { EncryptionApiService } from "backend/lib/encryption/encryption.service";
import { BadRequestError, progammingError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";
import { noop } from "shared/lib/noop";
import { IGroupCredential } from "../types";

export const INTEGRATION_CONFIG_GROUP_DEMILITER = "___";

export abstract class IntegrationsConfigurationApiService
  implements IApplicationService
{
  constructor(
    protected _persistenceService: AbstractConfigDataPersistenceService<string>,
    protected _encryptionApiService: EncryptionApiService
  ) {}

  static GROUP_DEMILITER = INTEGRATION_CONFIG_GROUP_DEMILITER;

  async bootstrap() {
    try {
      await this._persistenceService.setup();
    } catch (error) {
      noop();
    }
  }

  async hasKey(key: string): Promise<boolean> {
    return (await this.getValue(key)) !== undefined;
  }

  async hasGroupKey(group: IGroupCredential): Promise<boolean> {
    return await this.hasKey(
      this.generateGroupKeyPrefix(group.key, group.fields[0])
    );
  }

  async processDataToSave(data: string): Promise<string> {
    return data;
  }

  async processDataAfterFetch(data: string): Promise<string> {
    return data;
  }

  async list() {
    return Object.entries(
      await this._persistenceService.getAllAsKeyValuePair()
    ).map(([key, value]) => ({ key, value }));
  }

  async useGroupValue<T extends Record<string, unknown>>(
    group: IGroupCredential
  ): Promise<T> {
    progammingError(
      "You are trying to access group credentials with empty fields",
      group.fields.length === 0
    );

    const allGroupKeys = group.fields.map((field) =>
      this.generateGroupKeyPrefix(group.key, field)
    );

    const values = await Promise.all(
      allGroupKeys.map(async (key) => {
        return [key, await this.getValue(key)];
      })
    );

    const filteredValues = values.filter(([, value]) => value);

    if (filteredValues.length === 0) {
      throw new BadRequestError(`No credentials available for ${group.key}`);
    }

    return Object.fromEntries(
      filteredValues.map(([key, value]) => [
        key.split(IntegrationsConfigurationApiService.GROUP_DEMILITER)[1],
        value,
      ])
    ) as T;
  }

  async getValue(key: string): Promise<string | undefined> {
    const data = await this._persistenceService.getItem(key);

    if (!data) {
      return undefined;
    }

    return await this.processDataAfterFetch(data);
  }

  async upsertGroup(
    group: IGroupCredential,
    groupValue: Record<string, string>
  ) {
    const fieldsToUpsert = group.fields.filter(
      (field) => groupValue[field] !== undefined
    );

    for (const field of fieldsToUpsert) {
      await this.upsert(
        this.generateGroupKeyPrefix(group.key, field),
        groupValue[field]
      );
    }
  }

  async deleteGroup(group: IGroupCredential) {
    for (const field of group.fields) {
      await this.delete(this.generateGroupKeyPrefix(group.key, field));
    }
  }

  async upsert(key: string, value: string) {
    await this._persistenceService.upsertItem(
      key,
      await this.processDataToSave(value)
    );
  }

  async delete(key: string) {
    await this._persistenceService.removeItem(key);
  }

  private generateGroupKeyPrefix = (groupKey: string, groupField: string) => {
    return `${groupKey.toUpperCase()}${
      IntegrationsConfigurationApiService.GROUP_DEMILITER
    }${groupField}`;
  };
}
