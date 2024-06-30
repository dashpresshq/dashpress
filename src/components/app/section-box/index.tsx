import { ReactNode } from "react";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SoftButton } from "@/components/app/button/soft";
import { SystemIcon } from "@/components/app/system-icons";
import { ActionButtons } from "@/components/app/button/action";
import { IGroupActionButton } from "../button/types";
import { Tooltip } from "@/components/app/tooltip";

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
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {isLoading ? (
                <Skeleton className="w-40 h-5" />
              ) : (
                <p className="font-semibold">{_(title)}</p>
              )}
              {description ? (
                <Tooltip isOverAButton={false} text={description}>
                  <SystemIcon icon="Help" className="h-4 w-4" />
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
