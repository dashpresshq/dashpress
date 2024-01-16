import React, { useState, ReactNode } from "react";
import { ISelectData } from "shared/types/options";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { SoftButton } from "../../Button/SoftButton";
import { Card, CardBody, CardHeader } from "../../Card";
import { Tooltip } from "../../Tooltip";
import { BaseSkeleton } from "../../Skeleton/Base";
import { SimpleSelect } from "../../Form/FormSelect/Simple";
import { IActionButton } from "../../Button/ActionButtons/types";
import { ActionButtons } from "../../Button/ActionButtons";

export interface IProps {
  title: string;
  children: ReactNode;
  description?: string;
  actionButtons?: IActionButton[];
  selection?: { options: ISelectData[]; onChange: (value: string) => void };
  backLink?: { label?: string; action: string | (() => void) };
  isLoading?: boolean;
  headLess?: boolean;
}

export function SectionBox({
  children,
  title,
  isLoading,
  description,
  actionButtons,
  selection,
  backLink,
  headLess,
}: IProps) {
  const [selectionValue, setSelectionValue] = useState("");

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
            <Stack justify="space-between" align="center">
              <Stack>
                {isLoading ? (
                  <BaseSkeleton width="150px" height="20px" />
                ) : (
                  <Typo.MD weight="bold">{title}</Typo.MD>
                )}
                {description ? (
                  <Tooltip text={description}>
                    <SystemIcon icon="Help" size={15} />
                  </Tooltip>
                ) : null}
              </Stack>
              {!isLoading &&
                (actionButtons || selection ? (
                  <Stack align="center" width="auto">
                    {selection ? (
                      <SimpleSelect
                        options={selection.options}
                        onChange={(newSelectionValue: string) => {
                          setSelectionValue(newSelectionValue);
                          selection.onChange(newSelectionValue);
                        }}
                        width={50}
                        value={selectionValue}
                      />
                    ) : null}
                    <ActionButtons actionButtons={actionButtons} />
                  </Stack>
                ) : null)}
            </Stack>
          </CardHeader>
        ) : null}
        {children ? <CardBody>{children}</CardBody> : null}
      </Card>
    </>
  );
}
