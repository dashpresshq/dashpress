import { schemaService, SchemaService } from "./schema.service";
import { IJsonSchemaField } from "./types";

export class SchemaController {
  constructor(private schemaService: SchemaService) {}
  getSchemaMenuItems() {
    return this.schemaService.getAllSchemas();
  }

  listAllSchema() {
    return this.schemaService.getAllSchemas();
  }

  getSchemaFields(model: string): IJsonSchemaField[]{
      return this.schemaService.getSchemaFields(model);
  }

}

export const schemaController = new SchemaController(schemaService);
