import { configApiService, ConfigKeys } from "../config/config.service";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { DatabaseConfigDataPersistenceAdaptor } from "./DatabaseConfigDataPersistenceAdaptor";
import { JsonFileConfigDataPersistenceAdaptor } from "./JsonFileConfigDataPersistenceAdaptor";
import { MemoryConfigDataPersistenceAdaptor } from "./MemoryConfigDataPersistenceAdaptor";
import { RedisConfigDataPersistenceAdaptor } from "./RedisConfigDataPersistenceAdaptor";
import type { ConfigDomain } from "./types";
import { ConfigAdaptorTypes } from "./types";

export { AbstractConfigDataPersistenceService };

export function createConfigDomainPersistenceService<T>(
  configDomain: ConfigDomain
): AbstractConfigDataPersistenceService<T> {
  const configBag: Record<
    ConfigAdaptorTypes,
    AbstractConfigDataPersistenceService<T>
  > = {
    [ConfigAdaptorTypes.JsonFile]: new JsonFileConfigDataPersistenceAdaptor<T>(
      configDomain,
      configApiService
    ),
    [ConfigAdaptorTypes.Memory]: new MemoryConfigDataPersistenceAdaptor<T>(
      configDomain,
      configApiService
    ),
    [ConfigAdaptorTypes.Redis]: new RedisConfigDataPersistenceAdaptor<T>(
      configDomain,
      configApiService
    ),
    [ConfigAdaptorTypes.Database]: new DatabaseConfigDataPersistenceAdaptor<T>(
      configDomain,
      configApiService
    ),
  };

  return configBag[
    configApiService.getConfigValue<ConfigAdaptorTypes>(
      ConfigKeys.CONFIG_ADAPTOR
    )
  ];
}
