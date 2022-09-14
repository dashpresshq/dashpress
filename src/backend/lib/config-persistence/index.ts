import { ConfigKeys, configService } from "../config/config.service";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { DatabaseConfigDataPersistenceAdaptor } from "./DatabaseConfigDataPersistenceAdaptor";
import { JsonFileConfigDataPersistenceAdaptor } from "./JsonFileConfigDataPersistenceAdaptor";
import { MemoryConfigDataPersistenceAdaptor } from "./MemoryConfigDataPersistenceAdaptor";
import { RedisConfigDataPersistenceAdaptor } from "./RedisConfigDataPersistenceAdaptor";
import { ConfigAdaptorTypes, ConfigDomain } from "./types";

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
      configService
    ),
    [ConfigAdaptorTypes.Memory]: new MemoryConfigDataPersistenceAdaptor<T>(
      configDomain,
      configService
    ),
    [ConfigAdaptorTypes.Redis]: new RedisConfigDataPersistenceAdaptor<T>(
      configDomain,
      configService
    ),
    [ConfigAdaptorTypes.Database]: new DatabaseConfigDataPersistenceAdaptor<T>(
      configDomain,
      configService
    ),
  };

  return configBag[
    configService.getConfigValue<ConfigAdaptorTypes>(ConfigKeys.CONFIG_ADAPTOR)
  ];
}
