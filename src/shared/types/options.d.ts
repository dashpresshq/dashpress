import type { MessageDescriptor } from "@lingui/core";

export interface ILabelValue {
  value: string;
  label: string;
}

export type IKeyValue = {
  key: string;
  value: string;
};

export interface ISystemStatusForDisplay {
  label: MessageDescriptor;
  value: string | boolean;
  color?: string;
}

export interface ISelectData {
  value: string | boolean;
  label: MessageDescriptor;
}
