import { PackagesApiService, packagesApiService } from "./packages.service";

export class PackagesApiController {
  constructor(private _packagesApiService: PackagesApiService) {}

  async installPackages() {
    await this._packagesApiService.installPackages();
  }
}

export const packagesApiController = new PackagesApiController(
  packagesApiService
);
