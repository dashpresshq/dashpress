import { ConfigAdaptorTypes } from "backend/lib/config-persistence/types";
import {
  configApiService,
  ConfigKeys,
} from "backend/lib/config/config.service";
import { checkNodeVersion } from "bin/checkNodeVersion";
import latestVersion from "latest-version";
import { schemasApiService } from "backend/schema/schema.service";
import * as appRoot from "app-root-path";
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

      return {
        Foo: `${appRoot}`,
        "Hadmean Version": `v${version}${versionText}`,
        "Node Version": checkNodeVersion().message,
        "Config Adapter": configApiService.getConfigValue<ConfigAdaptorTypes>(
          ConfigKeys.CONFIG_ADAPTOR
        ),
        "Cache Adapter": configApiService.getConfigValue<ConfigAdaptorTypes>(
          ConfigKeys.CACHE_ADAPTOR
        ),
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
