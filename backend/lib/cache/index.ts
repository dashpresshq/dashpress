import { ConfigKeys, configService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";
import { MemoryCacheAdaptor } from "./MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "./RedisCacheAdaptor";
import { CacheAdaptorTypes } from "./types";

export { AbstractCacheService };

export function createCacheService(prefix: string): AbstractCacheService {
  const getInstance = () => {
    switch (
      configService.getConfigValue<CacheAdaptorTypes>(ConfigKeys.CONFIG_ADAPTOR)
    ) {
      case CacheAdaptorTypes.Memory:
        return new MemoryCacheAdaptor(prefix, configService);
      case CacheAdaptorTypes.Redis:
        return new RedisCacheAdaptor(prefix, configService);
    }
  };

  const instance = getInstance();

  return instance;
}
