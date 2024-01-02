export interface IEmptyWrapperProps {
  text: string;
  createNew?: { action: string | (() => void); label: string };
}
