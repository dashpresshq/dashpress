import React from "react";
import toast from "react-hot-toast";

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

export const ToastService = {
  success: (
    message:
      | string
      | { message: string; action: { label: string; action: () => void } }
  ) => {
    if (typeof message === "string") {
      toast.success(message as string, {
        style: toastStyle("success"),
      });
      return;
    }

    toast.success(
      (t) => (
        <div>
          <span>{message.message}</span>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              flexDirection: "row",
            }}
          >
            <button
              type="button"
              onClick={() => {
                message.action.action();
                toast.dismiss(t.id);
              }}
              style={{
                border: 0,
                display: "inline-block",
                background: "inherit",
                padding: 0,
                color: COLORS.success,
                fontSize: 14,
                marginTop: 4,
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
      }
    );
  },

  error: (message: unknown) =>
    toast.error(getBestErrorMessage(message), {
      style: toastStyle("danger"),
    }),
};
