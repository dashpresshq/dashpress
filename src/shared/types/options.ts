export interface ILabelValue {
  value: string;
  label: string;
}

export type IKeyValue = {
  key: string;
  value: string;
};

export const FOR_CODE_COV = 1;

export interface ISystemStatusForDisplay {
  label: string;
  value: string | boolean;
  color?: string;
}

export interface ISelectData {
  value: string | boolean;
  label: string;
}
