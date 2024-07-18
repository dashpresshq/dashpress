import type { MessageDescriptor } from "@lingui/core";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createStore } from "@/frontend/lib/store";

import { AppBlur } from "./app-blur";

interface IConfirmAlertDetails {
  title: MessageDescriptor;
  action: () => void;
}

type IStore = {
  title?: MessageDescriptor;
  action?: () => void;
  setDetails: (details: IConfirmAlertDetails) => void;
  onClose: () => void;
};

const useConfirmAlertStore = createStore<IStore>((set) => ({
  setDetails: (details: IConfirmAlertDetails) => set(() => details),
  onClose: () =>
    set(() => ({
      title: undefined,
      action: undefined,
    })),
}));

export const useConfirmAlert = () => {
  const confirmAlert = useConfirmAlertStore((store) => store.setDetails);

  return confirmAlert;
};

export function ConfirmAlert() {
  const { _ } = useLingui();
  const [title, action, onClose] = useConfirmAlertStore((store) => [
    store.title,
    store.action,
    store.onClose,
  ]);

  return (
    <AppBlur isOn={!!title}>
      <AlertDialog open={!!title} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle> {title ? _(title) : null}</AlertDialogTitle>
            <AlertDialogDescription>
              {t`Are you sure you want to do this?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t`Cancel`}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                action();
                onClose();
              }}
            >{t`Continue`}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppBlur>
  );
}
