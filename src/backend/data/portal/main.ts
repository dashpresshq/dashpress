/* eslint-disable max-classes-per-file */
import { noop } from "shared/lib/noop";
import { IDataApiService } from "../types";

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
  }: {
    dataApiService: IDataApiService;
    entity: string;
    beforeData: Record<string, unknown>;
    data: Record<string, unknown>;
    dataId: string;
  }) {
    noop(dataApiService, entity, data, dataId, beforeData);
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
