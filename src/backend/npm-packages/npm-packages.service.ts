import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { IApplicationService } from "backend/types";

// import { execa } from "execa";
import { NPM_PACKAGES_CONFIG, NpmPackageDomain } from "./constants";

export interface INpmPackage {
  packageDomain: NpmPackageDomain;
}

/*
  Install all the DB packages on init and then the current ones on subsequent installation for the project
*/

export class NpmPackagesApiService implements IApplicationService {
  constructor(
    private readonly _npmPackagesPersistenceService: AbstractConfigDataPersistenceService<INpmPackage>
  ) {}

  async bootstrap() {
    await this._npmPackagesPersistenceService.setup();
  }

  async installPackages(): Promise<void> {
    // if no Database installation then install all of them
    // else only install the activated one
    //
    // const packages = (await this.listPackages()).map((pkg) =>
    //   PACKAGES_VERSIONS[pkg] ? `${pkg}@${PACKAGES_VERSIONS[pkg]}` : pkg
    // );
    // const installPath = ["install"];
    // const { stdout, stderr } = execa("npm", [...installPath, ...packages]);
    // stdout.pipe(process.stdout);
    // stderr.pipe(process.stderr);
    //
    //
    // Create temp folder
    // add the fake npm packages
    // the move the npm packages to the node modules
  }
  /*
  npx hadmean
  */

  async listPackageDomains(): Promise<NpmPackageDomain[]> {
    const packageDomains =
      await this._npmPackagesPersistenceService.getAllItems();

    return packageDomains.map(({ packageDomain }) => packageDomain);
  }

  async isPackageDomainActive(
    packageDomain: NpmPackageDomain
  ): Promise<boolean> {
    return !!(await this._npmPackagesPersistenceService.getItem(packageDomain));
  }

  async addPackageDomain(packageDomain: NpmPackageDomain) {
    await this._npmPackagesPersistenceService.upsertItem(packageDomain, {
      packageDomain,
    });
  }

  async removePackageDomain(packageDomain: NpmPackageDomain) {
    await this._npmPackagesPersistenceService.removeItem(packageDomain);
  }
}

const npmPackagesPersistenceService =
  createConfigDomainPersistenceService<INpmPackage>("npm-packages");

export const npmPackagesApiService = new NpmPackagesApiService(
  npmPackagesPersistenceService
);
