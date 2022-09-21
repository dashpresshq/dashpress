import { ConfigDomain } from "backend/lib/config-persistence/types";
import { setupAppConfigTestData } from "./_app-config";
import { setupCredentialsTestData } from "./_credentials";
import { setupDashboardTestData } from "./_dashboard";
import { setupRolesTestData } from "./_roles";
import { setupSchemaTestData } from "./_schema";
import { setupUsersTestData } from "./_users";

export const setupAllTestData = async (domains: ConfigDomain[]) => {
  const allTestData: [ConfigDomain, () => Promise<void>][] = [
    ["credentials", setupCredentialsTestData],
    ["roles", setupRolesTestData],
    ["app-config", setupAppConfigTestData],
    ["users", setupUsersTestData],
    ["dashboard", setupDashboardTestData],
    ["schema", setupSchemaTestData],
  ];

  await Promise.all(
    allTestData
      .filter(([domain]) => {
        if (domains.length === 0) {
          return true;
        }
        return domains.includes(domain);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, testDataImpl]) => {
        return testDataImpl();
      })
  );
};
