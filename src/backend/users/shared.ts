import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import type { IAccountUser } from "shared/types/user";

export const usersPersistenceService =
  createConfigDomainPersistenceService<IAccountUser>("users");
