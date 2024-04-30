import { ReactNode } from "react";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { SoftButton } from "../../Button/SoftButton";
import { Card, CardBody, CardHeader } from "../../Card";
import { Tooltip } from "../../Tooltip";
import { BaseSkeleton } from "../../Skeleton/Base";
import { ActionButtons } from "../../Button/ActionButtons";
import { IGroupActionButton } from "../../Button/types";

export interface IProps {
  title: MessageDescriptor;
  children: ReactNode;
  description?: string;
  actionButtons?: IGroupActionButton[];
  backLink?: { label?: MessageDescriptor; action: string | (() => void) };
  isLoading?: boolean;
  headLess?: boolean;
}

export function SectionBox({
  children,
  title,
  isLoading,
  description,
  actionButtons,
  backLink,
  headLess,
}: IProps) {
  const { _ } = useLingui();

  return (
    <>
      {backLink && (
        <>
          <SoftButton
            action={backLink.action}
            size="xs"
            systemIcon="Left"
            label={backLink.label}
          />
          <Spacer />
        </>
      )}
      <Card>
        {!headLess ? (
          <CardHeader>
            <Stack $justify="space-between" $align="center">
              <Stack>
                {isLoading ? (
                  <BaseSkeleton width="150px" height="20px" />
                ) : (
                  <Typo.MD $weight="bold">{_(title)}</Typo.MD>
                )}
                {description ? (
                  <Tooltip text={description}>
                    <SystemIcon icon="Help" size={15} />
                  </Tooltip>
                ) : null}
              </Stack>
              {!isLoading &&
                (actionButtons ? (
                  <ActionButtons actionButtons={actionButtons} />
                ) : null)}
            </Stack>
          </CardHeader>
        ) : null}
        {children ? <CardBody>{children}</CardBody> : null}
      </Card>
    </>
  );
}
