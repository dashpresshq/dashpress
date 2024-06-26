import { useId } from "react";
import { SortableKnob } from "react-easy-sort";
import { SystemIconsKeys } from "shared/constants/Icons";
import { MessageDescriptor } from "@lingui/core";
import { cn } from "@/lib/utils";
import { GrabIcon, SystemIcon } from "../../system-icons";
import { FormButton } from "../../button/form";
import { FormSwitch } from "../../form/input/switch";

export interface IListMangerItemProps {
  label: string;
  systemIcon?: SystemIconsKeys;
  disabled?: boolean;
  sortable?: boolean;
  subtle?: boolean;
  toggle?: {
    selected: boolean;
    onChange: () => void;
  };
  actionButtons?: {
    id: string;
    isInverse: boolean;
    label: MessageDescriptor;
    systemIcon: SystemIconsKeys;
    onClick: () => void;
    isMakingRequest?: boolean;
    disabled?: boolean;
  }[];
}

export function ListManagerItem({
  label,
  systemIcon,
  disabled,
  toggle,
  sortable,
  subtle,
  actionButtons = [],
}: IListMangerItemProps) {
  const id = useId();
  const content = (
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-3">
        <div
          className={cn("hidden", {
            block: sortable && !subtle,
          })}
        >
          <SortableKnob>
            <GrabIcon />
          </SortableKnob>
        </div>
        {systemIcon ? (
          <SystemIcon
            className={cn("w-4 h-4  text-main", {
              "text-muted": subtle,
            })}
            icon={systemIcon}
          />
        ) : null}{" "}
        <div>
          <label htmlFor={id}>
            <p
              className={cn("text-sm text-main truncate", {
                "text-muted": subtle,
              })}
            >
              {label}
            </p>
          </label>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        {actionButtons.map(
          ({
            label: buttonLabel,
            isInverse,
            onClick: onClick$1,
            isMakingRequest,
            disabled: disabled$1,
            systemIcon: systemIcon$1,
          }) => (
            <FormButton
              key={buttonLabel.id}
              text={() => buttonLabel}
              size="sm"
              systemIcon={systemIcon$1}
              disabled={disabled$1}
              isMakingRequest={!!isMakingRequest}
              variant={isInverse ? "outline" : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClick$1();
              }}
            />
          )
        )}
        {toggle && (
          <FormSwitch
            name={id}
            onChange={toggle.onChange}
            value={toggle.selected}
          />
        )}
      </div>
    </div>
  );

  const buttonProps = {
    $disabled: !!disabled,
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center relative p-2 bg-base text-main border-b border-border cursor-pointer hover:bg-hover",
        {
          "text-muted bg-base pointer-events-none": disabled,
        }
      )}
      {...buttonProps}
    >
      {content}
    </div>
  );
}
