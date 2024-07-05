import { Frown } from "react-feather";
import { useLingui } from "@lingui/react";
import type { IEmptyWrapperProps } from "./types";
import { SoftButton } from "../button/soft";

export function EmptyWrapper({ text, createNew }: IEmptyWrapperProps) {
  const { _ } = useLingui();
  return (
    <div className="rounded-sm bg-base p-7 pb-5 text-center">
      <Frown size={50} className="mb-6 inline-block text-muted" />
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
