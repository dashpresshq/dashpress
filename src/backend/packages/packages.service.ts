import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";

import { execa } from "execa";
import { PACKAGES_VERSIONS } from "./constants";

export interface IPackage {
  pkg: string;
}

export class PackagesService implements IApplicationService {
  constructor(
    private readonly _packagesPersistenceService: AbstractConfigDataPersistenceService<IPackage>
  ) {}

  async bootstrap() {
    await this._packagesPersistenceService.setup();
  }

  async installPackages(): Promise<void> {
    const packages = (await this.listPackages()).map((pkg) =>
      PACKAGES_VERSIONS[pkg] ? `${pkg}@${PACKAGES_VERSIONS[pkg]}` : pkg
    );

    const installPath = ["install"];

    const { stdout, stderr } = execa("npm", [...installPath, ...packages]);

    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  }

  async listPackages(): Promise<string[]> {
    const roles = await this._packagesPersistenceService.getAllItems();

    return roles.map(({ pkg }) => pkg);
  }

  async addPackage(pkg: string) {
    if (!Object.keys(PACKAGES_VERSIONS).includes(pkg)) {
      throw new BadRequestError(`${pkg} in not a valid package`);
    }
    await this._packagesPersistenceService.upsertItem(pkg, {
      pkg,
    });
  }

  async removePackage(pkg: string) {
    await this._packagesPersistenceService.removeItem(pkg);
  }
}

const packagesPersistenceService =
  createConfigDomainPersistenceService<IPackage>("packages");

export const packagesService = new PackagesService(packagesPersistenceService);
