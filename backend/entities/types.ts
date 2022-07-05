export interface IEntityField {
  name: string;
  kind: 'scalar' | 'object' | 'enum';
  isRequired: boolean;
  isUnique: boolean;
  isId: true;
  relationFromFields?: string[];
  hasDefaultValue: boolean;
  type: 'String' | 'Int' | 'Boolean' | 'DateTime';
  default?: string | { name: string; args: never[] };
}
