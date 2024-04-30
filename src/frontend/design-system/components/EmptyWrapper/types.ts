import { MessageDescriptor } from "@lingui/core";

export interface IEmptyWrapperProps {
  text: MessageDescriptor;
  createNew?: { action: string | (() => void); label: MessageDescriptor };
}

export const FOR_CODE_COV = 1;
