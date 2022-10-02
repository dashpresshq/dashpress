import { setupApiHandlers } from "./setup";
import { accountApiHandlers } from "./account";
import { authApiHandlers } from "./auth";
import { entitiesApiHandlers } from "./entities";
import { dataApiHandlers } from "./data";
import { rolesApiHandlers } from "./roles";
import { configApiHandlers } from "./config";

export const apiHandlers = [
  ...setupApiHandlers,
  ...authApiHandlers,
  ...accountApiHandlers,
  ...entitiesApiHandlers,
  ...dataApiHandlers,
  ...dataApiHandlers,
  ...rolesApiHandlers,
  ...configApiHandlers,
];
