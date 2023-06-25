import { noop } from "shared/lib/noop";
import { DataCrudKeys } from "shared/types/data";

export class PortalFieldsFilterService {
  static async getFieldsToHide(
    entity: string,
    crudKey: DataCrudKeys,
    entityFieldList: string[]
  ): Promise<string[]> {
    noop(entity, crudKey, entityFieldList);
    return [];
  }
}
