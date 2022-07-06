import { SchemasService, schemasService } from '../schema/schema.service';
import { IJsonSchemaEnum } from '../schema/schema.types';

export class EnumsService {
  constructor(private _schemasService: SchemasService) {}

  private getJsonSchemaEnumsMap = (): Record<string, IJsonSchemaEnum> => Object.fromEntries(
    this._schemasService.listJsonSchemaEnums().map((enum$1) => [enum$1.name, enum$1]),
  );

  getEnumValues = (name: string): IJsonSchemaEnum => this.getJsonSchemaEnumsMap()[name];

  getEnumValuesAsList = (
    name: string,
  ): string[] => this.getJsonSchemaEnumsMap()[name]
    .values.map((value) => value.dbName || value.name);
}

export const enumsService = new EnumsService(schemasService);
