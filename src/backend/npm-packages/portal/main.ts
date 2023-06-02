export enum PortalNpmPackageDomain {
  Empty = "Empty",
}

export const PORTAL_NPM_PACKAGES_CONFIG: Record<
  PortalNpmPackageDomain,
  Record<string, string>
> = {
  [PortalNpmPackageDomain.Empty]: {},
};
