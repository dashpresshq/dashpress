import { IDBSchema, IEntityField, IEntityRelation } from "shared/types";
import { BadRequestError } from "../lib/errors";
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

  async getEntityRelations(entity: string): Promise<IEntityRelation[]> {
    return (await this.getEntityFromSchema(entity)).relations;
  }

  async getEntityPrimaryField(entity: string): Promise<string> {
    // TODO throw error is no iD field
    return (
      (await this.getEntityFields(entity)).find(({ isId }) => isId)?.name ||
      "id"
    );
  }

  private async _validateEntityField(
    entities: IEntityField[],
    entity: string,
    field?: string
  ): Promise<string | undefined> {
    if (!entities.find(({ name }) => name === field)) {
      throw new BadRequestError(`Invalid field '${field}' for ${entity}`);
    }
    return field as string;
  }

  async validateEntityField(entity: string, field: unknown): Promise<string> {
    if (!field) {
      return field as undefined;
    }
    const entities = await this.getEntityFields(entity);
    return await this._validateEntityField(entities, entity, field as string);
  }

  async validateEntityFields(entity: string, fields: string[]) {
    const entities = await this.getEntityFields(entity);
    fields.forEach(async (field) => {
      await this._validateEntityField(entities, entity, field);
    });
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
