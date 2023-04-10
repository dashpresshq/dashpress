import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IAccountUser } from "shared/types/user";

export const usersPersistenceService =
  createConfigDomainPersistenceService<IAccountUser>("users");
