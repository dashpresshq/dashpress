import { useEffect } from "react";
import type { Icon } from "react-feather";
import { AlertTriangle, Info as InfoIcon, ThumbsUp, X } from "react-feather";

import { Button } from "@/components/ui/button";
import type { SpectrumColorTypes } from "@/components/ui/spectrum";
import { spectrumVariants } from "@/components/ui/spectrum";
import { cn } from "@/components/utils";
import { useToggle } from "@/frontend/hooks/state/useToggleState";
import { getBestErrorMessage } from "@/frontend/lib/toast/utils";

export enum AlertType {
  Success = "success",
  Error = "danger",
  Warning = "warning",
  Info = "info",
}

interface IAlert {
  message: Record<string, unknown> | string | unknown;
  action?: {
    label: string;
    action: () => void;
    Icon: Icon;
  };
  renderJsx?: boolean;
}

export type IProps = {
  type: AlertType;
} & IAlert;

const AlertMap: Record<
  AlertType,
  { Icon: Icon; spectrum: SpectrumColorTypes }
> = {
  [AlertType.Info]: { Icon: InfoIcon, spectrum: "blue" },
  [AlertType.Error]: { Icon: AlertTriangle, spectrum: "red" },
  [AlertType.Warning]: { Icon: AlertTriangle, spectrum: "yellow" },
  [AlertType.Success]: { Icon: ThumbsUp, spectrum: "green" },
};

export function Alert({ type, message, renderJsx, action }: IProps) {
  const renderMode = useToggle(true);
  const { Icon: IconCmp, spectrum } = AlertMap[type];

  useEffect(() => {
    renderMode.on();
  }, [message]);

  if (!renderMode.isOn || !message) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-3 flex w-full items-center gap-3 rounded-md px-4 shadow-md",
        spectrumVariants({ spectrum })
      )}
      role="alert"
    >
      <div>
        <IconCmp size={24} />
      </div>
      <div className="my-3 w-full self-center">
        <p className="!m-0 text-sm">
          {(renderJsx ? message : getBestErrorMessage(message)) as string}
        </p>
        {action && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "mt-2 rounded-md border",
              spectrumVariants({ spectrum })
            )}
            onClick={action.action}
          >
            <div className="flex items-center gap-2">
              <action.Icon size="14" />
              {action.label}
            </div>
          </Button>
        )}
      </div>
      {type !== AlertType.Error && (
        <Button
          type="button"
          onClick={renderMode.off}
          variant="ghost"
          className="p-0"
          aria-label="Close"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}

export function ErrorAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Error} />;
}
export function SuccessAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Success} />;
}
export function InfoAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Info} />;
}
export function WarningAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Warning} />;
}
