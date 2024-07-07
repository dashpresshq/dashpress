import { useLingui } from "@lingui/react";
import React from "react";
import type { Icon as IconType } from "react-feather";
import { AlertCircle, CheckCircle, XCircle } from "react-feather";

import { spectrumVariants } from "@/components/ui/spectrum";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/components/utils";

import { useToast } from "./use-toast";

const ToastConfigMap: Record<
  "green" | "red" | "yellow",
  {
    Icon: IconType;
  }
> = {
  green: { Icon: CheckCircle },
  red: { Icon: XCircle },
  yellow: { Icon: AlertCircle },
};

export function Toaster() {
  const { toasts } = useToast();
  const { _ } = useLingui();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant, action, ...props }) => {
        const { Icon } = ToastConfigMap[variant];
        return (
          <Toast
            key={id}
            {...props}
            variant={variant}
            duration={variant === "red" || action ? 10000 : 5000}
          >
            <div className="flex items-center">
              <Icon className="mr-3 size-5 shrink-0" />
              <div className="flex flex-col gap-2">
                {title && <ToastTitle>{_(title)}</ToastTitle>}
                {description && (
                  <ToastDescription>{_(description)}</ToastDescription>
                )}
                {action && (
                  <ToastAction
                    onClick={action.action}
                    altText={_(action.label)}
                    className={cn(
                      "self-start",
                      spectrumVariants({
                        spectrum: variant,
                      })
                    )}
                  >
                    {_(action.label)}
                  </ToastAction>
                )}
              </div>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
