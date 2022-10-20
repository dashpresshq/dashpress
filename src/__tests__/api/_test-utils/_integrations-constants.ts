import { INTEGRATION_CONFIG_GROUP_DEMILITER } from "backend/integrations-configurations/services/_base";
import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";

const TEST_CONSTANTS: Record<string, string> = {
  CONSTANT_KEY_1: "CONSTANT_KEY_1",
  CONSTANT_KEY_2: "CONSTANT_KEY_2",
  [`GROUP_CONSTANT${INTEGRATION_CONFIG_GROUP_DEMILITER}KEY_3`]:
    "CONSTANT_KEY_3",
  [`GROUP_CONSTANT${INTEGRATION_CONFIG_GROUP_DEMILITER}KEY_4`]:
    "CONSTANT_KEY_4",
};

export const setupIntegrationsConstantsTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService<string>("constants");

  await configPersistenceService.resetToEmpty();

  for (const [key, value] of Object.entries(TEST_CONSTANTS)) {
    await configPersistenceService.upsertItem(key, value);
  }
};
