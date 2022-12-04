import { ConfigKeys, configService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";
import { MemoryCacheAdaptor } from "./MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "./RedisCacheAdaptor";
import { CacheAdaptorTypes } from "./types";

export { AbstractCacheService };

export function createCacheService(prefix: "permission"): AbstractCacheService {
  const configBag: Record<CacheAdaptorTypes, AbstractCacheService> = {
    [CacheAdaptorTypes.Memory]: new MemoryCacheAdaptor(prefix, configService),
    [CacheAdaptorTypes.Redis]: new RedisCacheAdaptor(prefix, configService),
  };

  return configBag[
    configService.getConfigValue<CacheAdaptorTypes>(ConfigKeys.CACHE_ADAPTOR)
  ];
}
