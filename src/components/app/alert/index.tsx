import { useEffect } from "react";
import {
  AlertTriangle,
  ThumbsUp,
  Icon,
  Info as InfoIcon,
  X,
} from "react-feather";
import { getBestErrorMessage } from "frontend/lib/toast/utils";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { cn } from "@/lib/utils";
import { SpectrumColorTypes, spectrumVariants } from "@/components/ui/spectrum";
import { Button } from "@/components/ui/button";

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
        "rounded-md shadow-md w-full flex items-center gap-3 px-4 mb-3",
        spectrumVariants({ spectrum })
      )}
      role="alert"
    >
      <div>
        <IconCmp size={24} />
      </div>
      <div className="w-full self-center my-3">
        <p className="text-sm !m-0">
          {(renderJsx ? message : getBestErrorMessage(message)) as string}
        </p>
        {action && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md border mt-2",
              spectrumVariants({ spectrum })
            )}
            onClick={action.action}
          >
            <div className="flex gap-2 items-center">
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
