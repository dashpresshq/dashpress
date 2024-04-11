export interface IEmptyWrapperProps {
  text: string;
  createNew?: { action: string | (() => void); label: string };
}

export const FOR_CODE_COV = 1;
