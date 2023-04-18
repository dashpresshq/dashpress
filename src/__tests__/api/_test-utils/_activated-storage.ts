import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IActivatedStorage } from "shared/types/storage";

const TEST_ACTIVATED_STORAGE: IActivatedStorage[] = [
  {
    key: "s3",
  },
  {
    key: "google",
  },
];

export const setupActivatedStorageTestData = async (
  testActivatedStorage: IActivatedStorage[] = TEST_ACTIVATED_STORAGE
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IActivatedStorage>(
      "activated-storage"
    );

  await configPersistenceService.resetState("key", testActivatedStorage);
};
