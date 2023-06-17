import { ConfigAdaptorTypes } from "backend/lib/config-persistence/types";
import { configApiService } from "backend/lib/config/config.service";
import { ConfigKeys } from "backend/lib/config/types";
import { checkNodeVersion } from "bin/checkNodeVersion";
import latestVersion from "latest-version";
import { schemasApiService } from "backend/schema/schema.service";
import { CacheAdaptorTypes } from "backend/lib/cache/types";
import { requestHandler } from "../../backend/lib/request";

const { version } = require("../../../package.json");

export default requestHandler(
  {
    GET: async (): Promise<Record<string, string>> => {
      const latestVersion$1 = await latestVersion("hadmean");

      const versionText =
        latestVersion$1 === version
          ? `(Latest Version)`
          : `. Version v${latestVersion$1} is now available.`;

      let cacheAdaptor = `${configApiService.getConfigValue<CacheAdaptorTypes>(
        ConfigKeys.CACHE_ADAPTOR
      )}`;

      if (cacheAdaptor !== CacheAdaptorTypes.Redis) {
        cacheAdaptor += " (Kindly use 'redis' when running multiple instances)";
      }

      let configAdaptor = `${configApiService.getConfigValue<ConfigAdaptorTypes>(
        ConfigKeys.CONFIG_ADAPTOR
      )}`;

      if (configAdaptor !== ConfigAdaptorTypes.Database) {
        configAdaptor +=
          " (Kindly use 'database' when you have more than two users on this application)";
      }

      return {
        "Hadmean Version": `v${version}${versionText}`,
        "Node Version": checkNodeVersion().message,
        "Config Adapter": configAdaptor,
        "Cache Adapter": cacheAdaptor,
        "Schema Last Updated": (
          await schemasApiService.getLastUpdatedDate()
        )?.toUTCString(),
      };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
