import type { MessageDescriptor } from "@lingui/core";
import { useId } from "react";
import { SortableKnob } from "react-easy-sort";
import type { SystemIconsKeys } from "shared/constants/Icons";

import { cn } from "@/lib/utils";

import { FormButton } from "../../button/form";
import { FormSwitch } from "../../form/input/switch";
import { GrabIcon, SystemIcon } from "../../system-icons";

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
    <div className="flex w-full justify-between">
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
            className={cn("size-4 text-main", {
              "text-muted": subtle,
            })}
            icon={systemIcon}
          />
        ) : null}{" "}
        <div>
          <label htmlFor={id}>
            <p
              className={cn("truncate text-sm text-main", {
                "text-muted": subtle,
              })}
            >
              {label}
            </p>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
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

  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center justify-between border-b border-border bg-base p-2 text-main hover:bg-hover",
        {
          "text-muted bg-base pointer-events-none": disabled,
        }
      )}
    >
      {content}
    </div>
  );
}
