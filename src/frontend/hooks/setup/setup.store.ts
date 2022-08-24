import { dataNotFoundMessage, useStorageApi } from "@hadmean/protozoa";
import { useRouter } from "next/router";
import { ISetupCheck } from "shared/types";

export const SETUP_CHECK_URL = "/api/setup/check";

interface ISetupCheckConfig {
  key: keyof ISetupCheck;
  value: boolean;
  url: string;
}

export function useSetupCheck(config: ISetupCheckConfig[]) {
  const router = useRouter();
  const { isLoading, data } = useStorageApi<ISetupCheck>(SETUP_CHECK_URL, {
    errorMessage: dataNotFoundMessage("Setup Check"),
  });
  if (isLoading) {
    return isLoading;
  }

  config.forEach((configItem) => {
    if (data[configItem.key] === configItem.value) {
      router.replace(configItem.url);
    }
  });

  return false;
}
