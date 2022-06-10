import {
  ConfigurationService,
  configurationService,
} from "../configuration/configuration.service";
import { schemaService, SchemaService } from "./schema.service";
import { IJsonSchemaField } from "./types";

export class SchemaController {
  constructor(
    private schemaService: SchemaService,
    private configurationService: ConfigurationService
  ) {}
 async getSchemaMenuItems() {
    const schemas = this.schemaService.getAllSchemas();
    const hiddenSchemas = (await this.configurationService.show("entities_to_hide_from_menu")) as string[];
    return schemas.filter(({value}) => !hiddenSchemas.includes(value))
  }

  listAllSchema() {
    return this.schemaService.getAllSchemas();
  }

  getSchemaFields(model: string): IJsonSchemaField[] {
    return this.schemaService.getSchemaFields(model);
  }

  getSchemaFieldsForTable(model: string): IJsonSchemaField[] {
    return this.schemaService.getSchemaFields(model);
  }

}

export const schemaController = new SchemaController(
  schemaService,
  configurationService
);
