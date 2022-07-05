import { filterScalarEntity } from 'shared/entity.logic';
import { BadRequestError } from '../lib/errors';
import { SchemasService, schemasService } from '../schema/schema.service';
import { IJsonSchemaModel } from '../schema/schema.types';
import { IEntityField } from './types';

export class EntitiesService {
  constructor(private schemasService: SchemasService) {}

  private getJsonSchemaModels = (): Record<string, IJsonSchemaModel> => Object.fromEntries(
    this.schemasService
      .listJsonSchemaModels()
      .map((model) => [model.name, model]),
  );

  getEntityFields = (entity: string): IEntityField[] => this.getEntityFromSchema(entity).fields;

  getScalarEntityFields = (entity: string): IEntityField[] => this.getEntityFromSchema(entity).fields.filter(filterScalarEntity);

  getEntityPrimaryField(entity: string): string {
    // TODO throw error is no iD field
    return this.getEntityFields(entity).find(({ isId }) => isId)?.name || 'id';
  }

  validateEntityField(entity: string, field: unknown) {
    if (!this.getEntityFields(entity).find(({ name }) => name === field)) {
      throw new BadRequestError(`Invalid field '${field}' for ${entity}`);
    }
    return field as string;
  }

  validateEntityFields(entity: string, fields: string[]) {
    fields.forEach((field) => {
      this.validateEntityField(entity, field);
    });
  }

  getEntityFromSchema = (entity: string): IJsonSchemaModel => this.getJsonSchemaModels()[entity];

  getAllEntities = () => this.schemasService.listJsonSchemaModels().map(({ name }) => ({
    value: name,
    label: name,
  }));
}

export const entitiesService = new EntitiesService(schemasService);
