import type { IAuthenticatedUserBag } from "./user";

export type IEvaluateScriptContext = {
  routeParams: Record<string, string>;
  auth: IAuthenticatedUserBag;
};
