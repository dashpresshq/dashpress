import { ConfigAdaptorTypes } from "backend/lib/config-persistence/types";
import {
  configApiService,
  ConfigKeys,
} from "backend/lib/config/config.service";
import { checkNodeVersion } from "bin/checkNodeVersion";
import latestVersion from "latest-version";
import { requestHandler } from "../../backend/lib/request";

const currentPkgJson = require("../../../package.json");

export default requestHandler(
  {
    GET: async (): Promise<Record<string, string>> => {
      const latestVersion$1 = await latestVersion("hadmean");

      const versionText =
        latestVersion$1 === currentPkgJson.version
          ? `(Latest Version)`
          : `. Version v${latestVersion$1} is now available.`;

      return {
        "Hadmean Version": `v${currentPkgJson.version}${versionText}`,
        "Node Version": checkNodeVersion().message,
        "Config Adapter": configApiService.getConfigValue<ConfigAdaptorTypes>(
          ConfigKeys.CONFIG_ADAPTOR
        ),
        "Cache Adapter": configApiService.getConfigValue<ConfigAdaptorTypes>(
          ConfigKeys.CACHE_ADAPTOR
        ),
        // TODO "Schema Last Updated",
      };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
