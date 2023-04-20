import { BaseDataAccessService } from "backend/data/data-access/_Base";
import noop from "lodash/noop";

export class PortalDataHooksService {
  static async beforeCreate({
    data,
    dataAccessSevice,
    entity,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    data: Record<string, unknown>;
  }) {
    noop(dataAccessSevice, entity, data);
  }

  static async afterCreate({
    data,
    dataAccessSevice,
    entity,
    insertId,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    data: Record<string, unknown>;
    insertId: string | number;
  }) {
    noop(dataAccessSevice, entity, data, insertId);
  }

  static async beforeUpdate({
    data,
    dataAccessSevice,
    dataId,
    entity,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    data: Record<string, unknown>;
    dataId: string;
  }): Promise<Record<string, unknown>> {
    noop(dataAccessSevice, entity, data, dataId);
    return {};
  }

  static async afterUpdate({
    beforeData,
    data,
    dataAccessSevice,
    dataId,
    entity,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    beforeData: Record<string, unknown>;
    data: Record<string, unknown>;
    dataId: string;
  }) {
    noop(dataAccessSevice, entity, data, dataId, beforeData);
  }

  static async beforeDelete({
    dataAccessSevice,
    entity,
    dataId,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    dataId: string;
  }) {
    noop(dataAccessSevice, entity, dataId);
  }

  static async afterDelete({
    dataAccessSevice,
    entity,
    dataId,
  }: {
    dataAccessSevice: BaseDataAccessService<unknown>;
    entity: string;
    dataId: string;
  }) {
    noop(dataAccessSevice, entity, dataId);
  }
}
