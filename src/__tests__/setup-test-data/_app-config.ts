import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";

const TEST_APP_CONFIG: Record<string, unknown> = {
  disabled_entities: ["bar", "baz"],
  entity_diction: {
    foo: {
      singular: "Singular Foo",
      plural: "Plural Foo",
    },
  },
};

export const setupAppConfigTestData = async () => {
  const appConfigPersistenceService =
    createConfigDomainPersistenceService("app-config");

  const configAsArray = Object.entries(TEST_APP_CONFIG);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of configAsArray) {
    // eslint-disable-next-line no-await-in-loop
    await appConfigPersistenceService.upsertItem(key, value);
  }
};
