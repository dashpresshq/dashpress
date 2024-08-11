import type { MessageDescriptor } from "@lingui/core";

export type ToastMessageInput = {
  description: MessageDescriptor;
  // action?: { label: MessageDescriptor; action: () => void };
};
