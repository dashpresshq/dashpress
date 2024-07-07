import { INTEGRATION_CONFIG_GROUP_DEMILITER } from "@/backend/integrations-configurations/services/_base";
import { createConfigDomainPersistenceService } from "@/backend/lib/config-persistence";
import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";

const TEST_ENVS: Record<string, string> = {
  ENV_KEY_1: "ENV_KEY_1",
  ENV_KEY_2: "ENV_KEY_2",
  [`GROUP_ENV${INTEGRATION_CONFIG_GROUP_DEMILITER}KEY_3`]: "ENV_KEY_3",
  [`GROUP_ENV${INTEGRATION_CONFIG_GROUP_DEMILITER}KEY_4`]: "ENV_KEY_4",
};

export const setupIntegrationsEnvTestData = async () => {
  const configPersistenceService = createConfigDomainPersistenceService<string>(
    "environment-variables"
  );

  await configPersistenceService.resetToEmpty();

  for (const [key, value] of typescriptSafeObjectDotEntries(TEST_ENVS)) {
    await configPersistenceService.upsertItem(key, value);
  }
};
