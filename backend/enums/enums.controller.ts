import { enumsService, EnumsService } from "./enums.service";

export class EnumsController {
  constructor(private enumsService: EnumsService) {}

  listEnumValues(name: string) {
    return this.enumsService.getEnumValuesAsList(name);
  }
}

export const enumsController = new EnumsController(enumsService);
