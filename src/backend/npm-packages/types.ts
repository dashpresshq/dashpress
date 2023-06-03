export interface INpmPackagesConfig {
  shouldInstall: () => Promise<boolean>;
  packages: {
    package: string;
    version: string;
  }[];
}
