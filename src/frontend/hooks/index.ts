import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";

export const isRouterParamEnabled = (entity: string): boolean =>
  !!entity && entity !== SLUG_LOADING_VALUE;
