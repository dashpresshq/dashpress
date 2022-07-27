import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { DatabaseConfigDataPersistenceAdaptor } from "./DatabaseConfigDataPersistenceAdaptor";
import { JsonFileConfigDataPersistenceAdaptor } from "./JsonFileConfigDataPersistenceAdaptor";
import { MemoryConfigDataPersistenceAdaptor } from "./MemoryConfigDataPersistenceAdaptor";
import { RedisConfigDataPersistenceAdaptor } from "./RedisConfigDataPersistenceAdaptor";
import { ConfigDomain } from "./types";

enum ConfigAdaptorTypes {
  JsonFile = "json-file",
  Database = "database",
  Memory = "memory",
  Redis = "redis",
}

const validateConfigAdaptorTypes = (
  adaptorName: string
): ConfigAdaptorTypes => {
  if (
    !Object.values(ConfigAdaptorTypes).includes(
      adaptorName as ConfigAdaptorTypes
    )
  ) {
    throw new Error(
      `Invalid config adaptor name provided ${adaptorName}. Valid values are ${Object.values(
        ConfigAdaptorTypes
      )}`
    );
  }
  return adaptorName as ConfigAdaptorTypes;
};

export function createConfigDomainPersistenceService<T>(
  configDomain: ConfigDomain
): AbstractConfigDataPersistenceService<T> {
  const configAdaptorName: ConfigAdaptorTypes = validateConfigAdaptorTypes(
    process.env.CONFIG_ADAPTOR || ConfigAdaptorTypes.JsonFile
  );
  switch (configAdaptorName) {
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
