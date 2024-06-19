import { Frown } from "react-feather";
import { useLingui } from "@lingui/react";
import { IEmptyWrapperProps } from "./types";
import { SoftButton } from "../button/soft";

export function EmptyWrapper({ text, createNew }: IEmptyWrapperProps) {
  const { _ } = useLingui();
  return (
    <div className="text-center p-7 pb-5 rounded-sm bg-base">
      <Frown size={50} className="text-muted mb-6 inline-block" />
      <p className="text-muted"> {_(text)} </p>
      {createNew && (
        <SoftButton
          className="mt-6"
          action={createNew.action}
          systemIcon="Plus"
          label={createNew.label}
        />
      )}
    </div>
  );
}
