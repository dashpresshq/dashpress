interface IDBSchemaRelation {
  table: string;
  relationType: string;
  joinColumnOptions?: {
    name: string;
    referencedColumnName: string;
    tag?: "inverse";
  }[];
}

export interface IEntityRelation {
  table: string;
  label: string;
  field?: string;
  type: "toOne" | "toMany";
  tag?: "inverse";
}

export interface IEntityField {
  name: string;
  isRequired?: true;
  length?: number;
  isId?: true;
  isReference?: true;
  type: "string" | "number" | "boolean" | "date" | "enum";
  enumeration?: string[];
}

export interface IDBSchema {
  name: string;
  fields: IEntityField[];
  uniqueFields: string[][];
  relations: IDBSchemaRelation[];
}

export const FOR_CODE_COV = 1;
