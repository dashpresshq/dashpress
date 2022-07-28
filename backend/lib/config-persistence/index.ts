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
  switch (
    configService.getConfigValue<ConfigAdaptorTypes>(ConfigKeys.CONFIG_ADAPTOR)
  ) {
    case ConfigAdaptorTypes.JsonFile:
      return new JsonFileConfigDataPersistenceAdaptor<T>(configDomain);
    case ConfigAdaptorTypes.Memory:
      return new MemoryConfigDataPersistenceAdaptor<T>(configDomain);
    case ConfigAdaptorTypes.Redis:
      return new RedisConfigDataPersistenceAdaptor<T>(configDomain);
    case ConfigAdaptorTypes.Database:
      return new DatabaseConfigDataPersistenceAdaptor<T>(configDomain);
  }
}
