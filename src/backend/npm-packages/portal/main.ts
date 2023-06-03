import { INpmPackagesConfig } from "../types";

export enum PortalNpmPackageDomain {
  Empty = "Empty",
}

export const PORTAL_NPM_PACKAGES_CONFIG: Record<
  PortalNpmPackageDomain,
  INpmPackagesConfig
> = {
  [PortalNpmPackageDomain.Empty]: {
    packages: [],
    shouldInstall: async () => false,
  },
};
