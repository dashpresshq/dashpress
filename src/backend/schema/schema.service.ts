import { introspect, Entity } from "@hadmean/bacteria";
import {
  ConfigurationService,
  configurationService,
} from "backend/configuration/configuration.service";
import {
  CredentialsService,
  credentialsService,
} from "backend/credentials/credentials.service";
import { CREDENTIALS_DOMAINS } from "backend/credentials/crendential.types";
import { IApplicationService } from "backend/types";
import { IDataSourceCredentials, IDBSchema, IEntityField } from "shared/types";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";

export class SchemasService implements IApplicationService {
  private dbSchema: IDBSchema[];

  constructor(
    private _schemaConfigDataPersistenceService: AbstractConfigDataPersistenceService<IDBSchema>,
    private _credentialsService: CredentialsService,
    private _configurationService: ConfigurationService
  ) {}

  async bootstrap() {
    await this._schemaConfigDataPersistenceService.setup();
    await this.loadDbSchema();
  }

  private async loadDbSchema(): Promise<IDBSchema[]> {
    if (this.dbSchema) {
      return this.dbSchema;
    }

    this.dbSchema = await this.initDBSchema();

    return this.dbSchema;
  }

  private async initDBSchema() {
    if (
      await this._configurationService.getSystemSettings("forceIntrospection")
    ) {
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
      await this._credentialsService.getValue<IDataSourceCredentials>(
        CREDENTIALS_DOMAINS.database
      );

    const schema = await introspect(dbCredentials);

    const dbSchema = this.formatIntrospectData(schema);

    await this._schemaConfigDataPersistenceService.resetState("name", dbSchema);

    return dbSchema;
  }

  private formatIntrospectData(rawEntity: Entity[]): IDBSchema[] {
    const dbSchema = rawEntity.map((entity) => {
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

const schemaPersistenceService =
  createConfigDomainPersistenceService<IDBSchema>("schema");

export const schemasService = new SchemasService(
  schemaPersistenceService,
  credentialsService,
  configurationService
);
