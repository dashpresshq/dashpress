import { introspect, Entity } from "@gothicgeeks/introspect";
import { IDBSchema, IEntityField } from "shared/types";
import { ConfigData } from "../lib/config-data";

export class SchemasService {
  private dbSchema: IDBSchema[];

  private async loadDbSchema(): Promise<IDBSchema[]> {
    if (this.dbSchema) {
      return this.dbSchema;
    }
    const schema = await introspect({
      databaseType: "postgres",
      host: "localhost",
      password: "password",
      schemaNames: ["public"],
      database: "kademiks",
      port: 5432,
      ssl: false,
      user: "postgres",
    });

    this.dbSchema = this.formatIntrospectData(schema);

    ConfigData.put("schema", this.dbSchema);

    return this.dbSchema;
  }

  private formatIntrospectData(rawEntity: Entity[]): IDBSchema[] {
    const dbSchema = rawEntity.map((entity) => {
      // TODO throw error is no iD field
      return {
        name: entity.name,
        fields: entity.columns.map((column) => {
          const column$: IEntityField = {
            name: column.options.name,
            isRequired: column.options.nullable ? true : undefined,
            length: column.options.length,
            isId: column.primary ? true : undefined,
            isReference: column.isUsedInRelationAsOwner ? true : undefined,
            type: column.options.enum
              ? "enum"
              : (column.tscType.toLocaleLowerCase() as IEntityField["type"]),
            enumeration: column.options.enum,
          };
          return column$;
        }),
        relations: entity.relations.map((relation) => {
          const relation$: IDBSchema["relations"][0] = {
            table: relation.relatedTable,
            relationType: relation.relationType,
            joinColumnOptions: relation.joinColumnOptions,
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

export const schemasService = new SchemasService();
