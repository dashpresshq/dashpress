import { StorageService, TemporayStorageService } from "frontend/lib/storage";

export const JWT_TOKEN_STORAGE_KEY = "__auth-token__";

export const getAuthToken = (): string | null =>
  TemporayStorageService.getString(JWT_TOKEN_STORAGE_KEY) ||
  StorageService.getString(JWT_TOKEN_STORAGE_KEY);

export const isAuthenticated = () => !!getAuthToken();

export const setAuthToken = (token: string, permanent?: boolean): void => {
  TemporayStorageService.setString(JWT_TOKEN_STORAGE_KEY, token);
  if (permanent) {
    StorageService.setString(JWT_TOKEN_STORAGE_KEY, token);
  }
};

export const removeAuthToken = (): void => {
  StorageService.removeString(JWT_TOKEN_STORAGE_KEY);
  TemporayStorageService.removeString(JWT_TOKEN_STORAGE_KEY);
};
