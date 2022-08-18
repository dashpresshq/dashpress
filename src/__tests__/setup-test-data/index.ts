import { setupAppConfigTestData } from "./_app-config";
import { setupRolesTestData } from "./_roles";

export const setupAllTestData = async () => {
  await setupRolesTestData();
  await setupAppConfigTestData();
};
