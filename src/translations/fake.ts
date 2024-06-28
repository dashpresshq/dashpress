import { ILabelValue } from "shared/types/options";

export const fakeMessageDescriptor = (value: string) => {
  return {
    id: value,
    message: value,
  };
};

export const transformLabelValueToSelectData = (input: ILabelValue[]) =>
  input.map(({ value, label }) => ({
    value,
    label: fakeMessageDescriptor(label),
  }));
