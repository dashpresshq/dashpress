import { enumsService, EnumsService } from "./enums.service";

export class EnumsController {
  constructor(private readonly _enumsService: EnumsService) {}

  listEnumValues(name: string) {
    return this._enumsService.getEnumValuesAsList(name);
  }
}

export const enumsController = new EnumsController(enumsService);
