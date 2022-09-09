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
  const getInstance = () => {
    switch (
      configService.getConfigValue<ConfigAdaptorTypes>(
        ConfigKeys.CONFIG_ADAPTOR
      )
    ) {
      case ConfigAdaptorTypes.JsonFile:
        return new JsonFileConfigDataPersistenceAdaptor<T>(
          configDomain,
          configService
        );
      case ConfigAdaptorTypes.Memory:
        return new MemoryConfigDataPersistenceAdaptor<T>(
          configDomain,
          configService
        );
      case ConfigAdaptorTypes.Redis:
        return new RedisConfigDataPersistenceAdaptor<T>(
          configDomain,
          configService
        );
      case ConfigAdaptorTypes.Database:
        return new DatabaseConfigDataPersistenceAdaptor<T>(
          configDomain,
          configService
        );
    }
  };

  const instance = getInstance();

  /*
  We dont need to setup for tests as it will break it
  This is because this will run before the test data is setup
  */
  if (process.env.NODE_ENV !== "test") {
    instance.setup();
  }

  return instance;
}
