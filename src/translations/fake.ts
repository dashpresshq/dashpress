import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { ILabelValue } from "shared/types/options";

export const fakeMessageDescriptor = (value: string) => {
  return {
    id: value,
    message: value,
  };
};
const noop = <T>(value: T) => value;

export const i18nNoop = (value: string | number): MessageDescriptor =>
  msg`${noop(value)}`;

export const transformLabelValueToSelectData = (input: ILabelValue[]) =>
  input.map(({ value, label }) => ({
    value,
    label: i18nNoop(label),
  }));
