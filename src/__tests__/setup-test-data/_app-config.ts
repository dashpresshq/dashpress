import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";

const TEST_APP_CONFIG: Partial<Record<string, unknown>> = {
  disabled_entities: ["disabled-entity-1", "disabled-entity-2"],
  "entity_diction__base-model": {
    singular: "Base Model",
    plural: "Base Models",
  },
};

export const setupAppConfigTestData = async (
  appConfig: Partial<Record<string, unknown>> = TEST_APP_CONFIG
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService("app-config");

  await configPersistenceService.resetToEmpty();

  const configAsArray = Object.entries(appConfig);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of configAsArray) {
    // eslint-disable-next-line no-await-in-loop
    await configPersistenceService.upsertItem(key, value);
  }
};
