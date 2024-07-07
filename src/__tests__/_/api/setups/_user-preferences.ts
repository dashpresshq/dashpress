import { createConfigDomainPersistenceService } from "@/backend/lib/config-persistence";

export const setupUserPreferencesTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService("users-preferences");

  await configPersistenceService.resetToEmpty();
};
