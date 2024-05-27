interface IDBSchemaRelation {
  table: string;
  relationType: "ManyToOne" | "OneToMany" | "OneToOne" | "ManyToMany";
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
  inverseToOneField?: string;
  type: "toOne" | "toMany";
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
