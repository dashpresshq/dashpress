import { ConfigKeys, configApiService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";
import { MemoryCacheAdaptor } from "./MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "./RedisCacheAdaptor";
import { CacheAdaptorTypes, CacheDomain } from "./types";

export { AbstractCacheService };

export function createCacheService(prefix: CacheDomain): AbstractCacheService {
  const configBag: Record<CacheAdaptorTypes, AbstractCacheService> = {
    [CacheAdaptorTypes.Memory]: new MemoryCacheAdaptor(
      prefix,
      configApiService
    ),
    [CacheAdaptorTypes.Redis]: new RedisCacheAdaptor(prefix, configApiService),
  };

  return configBag[
    configApiService.getConfigValue<CacheAdaptorTypes>(ConfigKeys.CACHE_ADAPTOR)
  ];
}
