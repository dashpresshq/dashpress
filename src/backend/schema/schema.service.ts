import type { Entity } from "@dashpress/bacteria";
import { introspect } from "@dashpress/bacteria";
import type { Column } from "@dashpress/bacteria/dist/models/Column";
import { DATABASE_CREDENTIAL_GROUP } from "backend/data/fields";
import type { CredentialsApiService } from "backend/integrations-configurations";
import { credentialsApiService } from "backend/integrations-configurations";
import type { IDataSourceCredentials } from "shared/types/data-sources";
import type { IDBSchema, IEntityField } from "shared/types/db";

import type { AbstractConfigDataPersistenceService } from "../lib/config-persistence";
import { createConfigDomainPersistenceService } from "../lib/config-persistence";

export class SchemasApiService {
  private dbSchema: IDBSchema[];

  constructor(
    private _schemaConfigDataPersistenceService: AbstractConfigDataPersistenceService<IDBSchema>,
    private _credentialsService: CredentialsApiService
  ) {}

  async runOnLoad() {
    await this.loadDbSchema();
  }

  async getLastUpdatedDate() {
    const dbSchema = await this.getDBSchema();

    return await this._schemaConfigDataPersistenceService.getItemLastUpdated(
      dbSchema[0].name
    );
  }

  private async loadDbSchema(): Promise<IDBSchema[]> {
    if (this.dbSchema) {
      return this.dbSchema;
    }

    this.dbSchema = await this.initDBSchema();

    return this.dbSchema;
  }

  private async initDBSchema() {
    if (process.env.NODE_ENV === "production") {
      return await this.doIntrospection();
    }

    const savedDbSchema =
      await this._schemaConfigDataPersistenceService.getAllItems();

    if (savedDbSchema.length > 0) {
      return savedDbSchema;
    }
    return await this.doIntrospection();
  }

  private async doIntrospection() {
    const dbCredentials =
      await this._credentialsService.useGroupValue<IDataSourceCredentials>(
        DATABASE_CREDENTIAL_GROUP
      );

    const schema = await introspect(dbCredentials);

    const dbSchema = this.formatIntrospectData(schema);

    await this._schemaConfigDataPersistenceService.resetState("name", dbSchema);

    return dbSchema;
  }

  private getEntityType(column: Column): IEntityField["type"] {
    if (column.options.enum) {
      return "enum";
    }
    if (column.type === "date") {
      return "date";
    }
    return column.tscType.toLocaleLowerCase() as IEntityField["type"];
  }

  private formatIntrospectData(rawEntity: Entity[]): IDBSchema[] {
    const dbSchema = rawEntity
      .filter(({ name }) => !name.startsWith("dashpress"))
      .map((entity) => {
        return {
          name: entity.name,
          fields: entity.columns.map((column) => {
            const column$: IEntityField = {
              name: column.options.name,
              isRequired: column.options.nullable ? undefined : true,
              length: column.options.length,
              isId: column.primary ? true : undefined,
              isReference: column.isUsedInRelationAsOwner ? true : undefined,
              type: this.getEntityType(column),
              enumeration: column.options.enum,
            };
            return column$;
          }),
          relations: entity.relations.map((relation) => {
            // eslint-disable-next-line prefer-destructuring
            let joinColumnOptions: IDBSchema["relations"][0]["joinColumnOptions"] =
              relation.joinColumnOptions;

            if (relation.relationType === "OneToOne" && !joinColumnOptions) {
              const joinTable = relation.relatedTable;

              const joinTableDetails = rawEntity.find(
                (eachRawEntity) => eachRawEntity.name === joinTable
              );

              const otherRelation = joinTableDetails.relations.find(
                (relationEntity) => relationEntity.relatedTable === entity.name
              );

              joinColumnOptions = [
                {
                  name: otherRelation.joinColumnOptions[0].referencedColumnName,
                  referencedColumnName: otherRelation.joinColumnOptions[0].name,
                  tag: "inverse",
                },
              ];
            }

            const relation$: IDBSchema["relations"][0] = {
              table: relation.relatedTable,
              relationType: relation.relationType,
              joinColumnOptions,
            };
            return relation$;
          }),
          uniqueFields: entity.indices
            .filter((index) => index.options.unique)
            .map((index) => index.columns),
        } as IDBSchema;
      });
    dbSchema.sort((a, b) => a.name.localeCompare(b.name));
    return dbSchema;
  }

  async getDBSchema(): Promise<IDBSchema[]> {
    return await this.loadDbSchema();
  }
}

const schemaPersistenceService =
  createConfigDomainPersistenceService<IDBSchema>("schema");

export const schemasApiService = new SchemasApiService(
  schemaPersistenceService,
  credentialsApiService
);
