import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

export const ROYGBIV = {
  red: "#FF165D",
  orange: "#FF851B",
  green: "#2ECC40",
  blue: "#0074D9",
  indigo: "#4B0082",
  violet: "#B10DC9",
  brown: "#964B00",
};

export const ROYGBIV_CONFIG: Record<
  keyof typeof ROYGBIV,
  {
    label: MessageDescriptor;
  }
> = {
  red: { label: msg`Red` },
  orange: { label: msg`Orange` },
  green: { label: msg`Green` },
  blue: { label: msg`Blue` },
  indigo: { label: msg`Indigo` },
  violet: { label: msg`Violet` },
  brown: { label: msg`Brown` },
};
