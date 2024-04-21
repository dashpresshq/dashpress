import toast, { Toast } from "react-hot-toast";
import { X } from "react-feather";
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

function ToastMessage({ message, toastT }: { message: string; toastT: Toast }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
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

export const ToastService = {
  success: (
    message:
      | string
      | { message: string; action: { label: string; action: () => void } }
  ) => {
    if (typeof message === "string") {
      toast.success((t) => <ToastMessage message={message} toastT={t} />, {
        style: toastStyle("success"),
        duration: 7000,
        id: message,
      });
      return;
    }

    toast.success(
      (t) => (
        <div>
          <ToastMessage message={message.message} toastT={t} />
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
                toast.dismiss(t.id);
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
              {message.action.label}
            </button>
          </div>
        </div>
      ),
      {
        style: toastStyle("success"),
        duration: 7000,
        id: message.message,
      }
    );
  },

  error: (message: unknown) => {
    const errorMessage = getBestErrorMessage(message);
    toast.error((t) => <ToastMessage message={errorMessage} toastT={t} />, {
      style: toastStyle("danger"),
      duration: 7000,
      id: errorMessage,
    });
  },
};
