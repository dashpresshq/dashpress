import { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { EncryptionService } from "backend/lib/encryption/encryption.service";
import { ForbiddenError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";
import noop from "lodash/noop";
import { CredentialsGroup, CREDENTIALS_GROUP } from "./crendential.types";

const GROUP_DEMILITER = "___";

export abstract class BaseApplicationConfigs implements IApplicationService {
  constructor(
    protected _persistenceService: AbstractConfigDataPersistenceService<string>,
    protected _encryptionService: EncryptionService
  ) {}

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

  async hasGroupKey(groupKey: CredentialsGroup): Promise<boolean> {
    const groupFields = CREDENTIALS_GROUP[groupKey];
    return await this.hasKey(
      this.generateGroupKeyPrefix(groupKey, groupFields[0])
    );
  }

  async processDataToSave(data: string): Promise<string> {
    return data;
  }

  async processDataAfterFetch(data: string): Promise<string> {
    return data;
  }

  async list() {}

  async useGroupValue<T>(groupKey: CredentialsGroup): Promise<T> {
    const groupFields = CREDENTIALS_GROUP[groupKey];

    const allGroupKeys = groupFields.map((field) =>
      this.generateGroupKeyPrefix(groupKey, field)
    );

    const values = await Promise.all(
      allGroupKeys.map(async (key) => {
        return [key, await this.getValue(key)];
      })
    );

    const filteredValues = values.filter(([, value]) => value);

    if (filteredValues.length === 0) {
      throw new ForbiddenError(`No credentials available for ${groupKey}`);
    }

    return Object.fromEntries(
      filteredValues.map(([key, value]) => [
        key.split(GROUP_DEMILITER)[1],
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

  async useValue(key: string): Promise<string> {
    const value = this.getValue(key);
    if (value === undefined) {
      throw new ForbiddenError(`No credentials available for ${key}`);
    }
    return value;
  }

  async upsertGroup(
    groupKey: CredentialsGroup,
    groupValue: Record<string, string>
  ) {
    const groupFields = CREDENTIALS_GROUP[groupKey];

    const fieldsToUpsert = groupFields.filter(
      (field) => groupValue[field] !== undefined
    );

    for (const field of fieldsToUpsert) {
      await this.upsert(
        this.generateGroupKeyPrefix(groupKey, field),
        groupValue[field]
      );
    }
  }

  async upsert(key: string, value: string) {
    await this._persistenceService.upsertItem(
      key,
      await this.processDataToSave(value)
    );
  }

  private generateGroupKeyPrefix = (groupKey: string, groupField: string) => {
    return `${groupKey.toUpperCase()}${GROUP_DEMILITER}${groupField}`;
  };
}
