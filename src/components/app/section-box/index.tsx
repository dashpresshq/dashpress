import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import type { ReactNode } from "react";

import { ActionButtons } from "@/components/app/button/action";
import { SoftButton } from "@/components/app/button/soft";
import { SystemIcon } from "@/components/app/system-icons";
import { Tooltip } from "@/components/app/tooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { IGroupActionButton } from "../button/types";

export interface IProps {
  title: MessageDescriptor;
  children: ReactNode;
  description?: string;
  actionButtons?: IGroupActionButton[];
  backLink?: { label?: MessageDescriptor; action: string | (() => void) };
  isLoading?: boolean;
}

export function SectionBox({
  children,
  title,
  isLoading,
  description,
  actionButtons,
  backLink,
}: IProps) {
  const { _ } = useLingui();

  return (
    <div>
      {backLink && (
        <SoftButton
          action={backLink.action}
          className="mb-2"
          systemIcon="Left"
          size="sm"
          label={backLink.label}
        />
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {isLoading ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                <p className="font-semibold">{_(title)}</p>
              )}
              {description ? (
                <Tooltip isOverAButton={false} text={description}>
                  <SystemIcon icon="Help" className="size-4" />
                </Tooltip>
              ) : null}
            </div>
            {!isLoading &&
              (actionButtons ? (
                <ActionButtons actionButtons={actionButtons} />
              ) : null)}
          </div>
        </CardHeader>
        {children ? <CardContent>{children}</CardContent> : null}
      </Card>
    </div>
  );
}
