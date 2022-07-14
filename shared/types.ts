export interface IEntityField {
  name: string;
  isRequired?: true;
  length?: number;
  isId?: true;
  isReference?: true;
  type: "string" | "number" | "boolean" | "date" | "enum";
  enumeration?: string[];
}

export interface IEntityRelation {
  table: string;
  relationType: string;
  joinColumnOptions?: {
    name: string;
    referencedColumnName: string;
  }[];
}

export interface IDBSchema {
  name: string;
  fields: IEntityField[];
  uniqueFields: string[][];
  relations: IEntityRelation[];
}
