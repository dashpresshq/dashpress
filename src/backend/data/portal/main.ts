/* eslint-disable max-classes-per-file */
import { noop } from "shared/lib/noop";
import type { QueryFilterSchema } from "shared/types/data";
import type { IDataApiService } from "../types";

export class PortalDataHooksService {
  static async beforeCreate({
    data,
    dataApiService,
    entity,
  }: {
    dataApiService: IDataApiService;
    entity: string;
    data: Record<string, unknown>;
  }) {
    noop(entity, dataApiService, data);
  }

  static async afterCreate({
    data,
    dataApiService,
    entity,
    insertId,
  }: {
    dataApiService: IDataApiService;
    entity: string;
    data: Record<string, unknown>;
    insertId: string | number;
  }) {
    noop(dataApiService, entity, data, insertId);
  }

  static async beforeUpdate({
    data,
    dataApiService,
    dataId,
    entity,
  }: {
    dataApiService: IDataApiService;
    entity: string;
    data: Record<string, unknown>;
    dataId: string;
  }): Promise<Record<string, unknown>> {
    noop(dataApiService, entity, data, dataId);
    return {};
  }

  static async afterUpdate({
    beforeData,
    data,
    dataApiService,
    dataId,
    entity,
    options,
  }: {
    dataApiService: IDataApiService;
    entity: string;
    beforeData: Record<string, unknown>;
    data: Record<string, unknown>;
    dataId: string;
    options?: {
      skipDataEvents?: boolean;
    };
  }) {
    noop(dataApiService, entity, data, dataId, beforeData, options);
  }

  static async beforeDelete({
    dataApiService,
    entity,
    dataId,
  }: {
    dataApiService: IDataApiService;
    entity: string;
    dataId: string;
  }) {
    noop(dataApiService, entity, dataId);
  }

  static async afterDelete({
    beforeData,
    dataApiService,
    entity,
    dataId,
  }: {
    beforeData: void;
    dataApiService: IDataApiService;
    entity: string;
    dataId: string;
  }) {
    noop(dataApiService, entity, dataId, beforeData);
  }
}

export class PortalQueryImplementation {
  static async delete(params: {
    entity: string;
    queryFilter: QueryFilterSchema;
    implementation: () => Promise<void>;
  }) {
    await params.implementation();
  }

  static async query(
    queryFilter: QueryFilterSchema,
    entity: string
  ): Promise<QueryFilterSchema> {
    noop(entity);
    return queryFilter;
  }
}
