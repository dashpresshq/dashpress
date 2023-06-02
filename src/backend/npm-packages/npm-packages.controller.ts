import {
  NpmPackagesApiService,
  npmPackagesApiService,
} from "./npm-packages.service";

export class NpmPackagesApiController {
  constructor(private _npmPackagesApiService: NpmPackagesApiService) {}

  async installPackages() {
    await this._npmPackagesApiService.installPackages();
  }
}

export const npmPackagesApiController = new NpmPackagesApiController(
  npmPackagesApiService
);
