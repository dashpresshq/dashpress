import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { useApi } from "frontend/lib/data/useApi";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ISetupCheck } from "shared/types/auth";

export const SETUP_CHECK_URL = "/api/setup/check";

interface ISetupCheckConfig {
  key: keyof ISetupCheck;
  value: boolean;
  url: string;
}

export function useSetupCheck(config: ISetupCheckConfig[]) {
  const router = useRouter();
  const { isLoading, data } = useApi<ISetupCheck>(SETUP_CHECK_URL, {
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Setup Check`),
    defaultData: {
      hasDbCredentials: undefined,
      hasUsers: undefined,
    },
    persist: true,
  });

  useEffect(() => {
    for (const configItem of config) {
      if (data[configItem.key] === configItem.value) {
        router.replace(configItem.url, configItem.url, {
          locale: router.locale,
        });
        return;
      }
    }
  }, [data]);

  if (isLoading || !data) {
    return isLoading;
  }

  return false;
}
