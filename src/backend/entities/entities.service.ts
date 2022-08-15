import { IDBSchema, IEntityField } from "shared/types";
import { SchemasService, schemasService } from "../schema/schema.service";

export class EntitiesService {
  constructor(private _schemasService: SchemasService) {}

  private async getDBSchemaModels(): Promise<Record<string, IDBSchema>> {
    return Object.fromEntries(
      (await this._schemasService.getDBSchema()).map((model) => [
        model.name,
        model,
      ])
    );
  }

  async getEntityFields(entity: string): Promise<IEntityField[]> {
    return (await this.getEntityFromSchema(entity)).fields;
  }

  async getEntityRelations(entity: string): Promise<IDBSchema["relations"]> {
    return (await this.getEntityFromSchema(entity)).relations;
  }

  async getEntityPrimaryField(entity: string): Promise<string> {
    return (
      (await this.getEntityFields(entity)).find(({ isId }) => isId)?.name ||
      "id"
    );
  }

  async getEntityFromSchema(entity: string): Promise<IDBSchema> {
    return (await this.getDBSchemaModels())[entity];
  }

  async getAllEntities(): Promise<{ value: string; label: string }[]> {
    return (await this._schemasService.getDBSchema()).map(({ name }) => ({
      value: name,
      label: name,
    }));
  }
}

export const entitiesService = new EntitiesService(schemasService);
