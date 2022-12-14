import { PackagesService, packagesService } from "./packages.service";

export class PackagesController {
  constructor(private _packagesService: PackagesService) {}

  async installPackages() {
    await this._packagesService.installPackages();
  }
}

export const packagesController = new PackagesController(packagesService);
