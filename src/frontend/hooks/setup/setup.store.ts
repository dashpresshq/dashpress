import { useStorageApi } from "@hadmean/protozoa";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/makeCrudConfig";
import { useRouter } from "next/router";
import { ISetupCheck } from "shared/types/auth";

export const SETUP_CHECK_URL = "/api/setup/check";

interface ISetupCheckConfig {
  key: keyof ISetupCheck;
  value: boolean;
  url: string;
}

export function useSetupCheck(config: ISetupCheckConfig[]) {
  const router = useRouter();
  const { isLoading, data } = useStorageApi<ISetupCheck>(SETUP_CHECK_URL, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Setup Check"),
    defaultData: {
      hasDbCredentials: false,
      hasUsers: false,
    },
  });

  if (isLoading || !data) {
    return isLoading;
  }

  config.forEach((configItem) => {
    if (data[configItem.key] === configItem.value) {
      router.replace(configItem.url);
    }
  });

  return false;
}
