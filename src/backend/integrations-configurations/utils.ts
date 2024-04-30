import { INTEGRATION_CONFIG_GROUP_DEMILITER } from "./services/_base";
import { credentialsApiService } from "./services/credentials.service";
import { appConstantsApiService } from "./services/env-variable.service";

export const getAppCredentialsAndConstants = async () => {
  const appConstants = Object.fromEntries(
    (await appConstantsApiService.list()).map(({ key, value }) => [key, value])
  );

  const credentials: Record<string, string> = Object.fromEntries(
    await Promise.all(
      (await credentialsApiService.list())
        .filter(({ key }) => !key.includes(INTEGRATION_CONFIG_GROUP_DEMILITER))
        .map(async ({ key, value }) => [
          key,
          await credentialsApiService.processDataAfterFetch(value),
        ])
    )
  );

  return {
    appConstants,
    credentials,
  };
};
