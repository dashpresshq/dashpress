import toast, { Toast } from "react-hot-toast";
import { X } from "react-feather";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";
import { i18nNoop } from "shared/lib/noop";
import { getBestErrorMessage } from "./utils";

const COLORS = {
  danger: "#ff4b4b",
  success: "#61d345",
};

const toastStyle = (color: keyof typeof COLORS) => ({
  borderRadius: `4px`,
  borderTop: `2px solid ${color}`,
  maxWidth: "550px",
});

function isMessageDescriptor<T>(
  message: MessageDescriptor | T
): message is MessageDescriptor {
  return typeof (message as MessageDescriptor).message === "string";
}

type ToastMessageWithAction = {
  message: MessageDescriptor;
  action: { label: MessageDescriptor; action: () => void };
};

function ToastMessage({
  message,
  toastT,
}: {
  message: MessageDescriptor;
  toastT: Toast;
}) {
  const { _ } = useLingui();
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span>{_(message)}</span>
      <X
        size="18"
        role="button"
        style={{
          cursor: "pointer",
          marginLeft: "12px",
        }}
        aria-label="Close Toast"
        onClick={() => {
          toast.dismiss(toastT.id);
        }}
      />
    </span>
  );
}

function ToastAction({
  message,
  toastId,
}: {
  message: ToastMessageWithAction;
  toastId: string;
}) {
  const { _ } = useLingui();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        onClick={() => {
          message.action.action();
          toast.dismiss(toastId);
        }}
        style={{
          cursor: "pointer",
          border: 0,
          display: "inline-block",
          background: "inherit",
          padding: 0,
          color: COLORS.success,
          fontSize: 15,
          marginTop: 8,
        }}
      >
        {_(message.action.label)}
      </button>
    </div>
  );
}

export const ToastService = {
  success: (message: MessageDescriptor | ToastMessageWithAction) => {
    if (isMessageDescriptor(message)) {
      toast.success((t) => <ToastMessage message={message} toastT={t} />, {
        style: toastStyle("success"),
        duration: 7000,
        id: message.id,
      });
      return;
    }

    toast.success(
      (t) => (
        <div>
          <ToastMessage message={message.message} toastT={t} />
          <ToastAction message={message} toastId={t.id} />
        </div>
      ),
      {
        style: toastStyle("success"),
        duration: 7000,
        id: message.message.id,
      }
    );
  },

  error: (message: unknown) => {
    const errorMessage = getBestErrorMessage(message);
    toast.error(
      (t) => (
        <ToastMessage message={msg`${i18nNoop(errorMessage)}`} toastT={t} />
      ),
      {
        style: toastStyle("danger"),
        duration: 7000,
        id: errorMessage,
      }
    );
  },
};
