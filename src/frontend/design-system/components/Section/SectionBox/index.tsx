import React, { useState, ReactNode } from "react";
import styled from "styled-components";
import { HelpCircle } from "react-feather";
import { ISelectData } from "shared/types/options";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Text";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { DeleteButton } from "../../Button/DeleteButton";
import { SimpleSelect } from "../../Form";
import { SoftButton } from "../../Button/SoftButton";
import { StyledCard, StyledCardBody, StyledCardHeader } from "../../Card";
import { Tooltip } from "../../Tooltip";
import { ButtonIconTypes } from "../../Button/constants";
import { BaseSkeleton } from "../../Skeleton/Base";

export interface IProps {
  title: string;
  children: ReactNode;
  description?: string;
  newItemLink?: string;
  iconButtons?: {
    action: string | (() => void);
    label?: string;
    icon?: ButtonIconTypes;
  }[];
  selection?: { options: ISelectData[]; onChange: (value: string) => void };
  deleteAction?: {
    action: () => void;
    isMakingDeleteRequest: boolean;
    shouldConfirmAlert?: boolean;
  };
  backLink?: { label?: string; action: string | (() => void) };
  isLoading?: boolean;
  headLess?: boolean;
  sideText?: string;
}

const StyledDeleteButton = styled(DeleteButton)`
  margin-left: 0.25rem;
`;

export function SectionBox({
  children,
  title,
  isLoading,
  description,
  newItemLink,
  iconButtons,
  selection,
  backLink,
  deleteAction,
  headLess,
  sideText,
}: IProps) {
  const [selectionValue, setSelectionValue] = useState("");

  return (
    <>
      {backLink && (
        <>
          <SoftButton
            action={backLink.action}
            size="xs"
            icon="back"
            label={backLink.label}
          />
          <Spacer />
        </>
      )}
      <StyledCard>
        {!headLess ? (
          <StyledCardHeader>
            <Stack justify="space-between" align="center">
              <Stack>
                {isLoading ? (
                  <BaseSkeleton width="150px" height="20px" />
                ) : (
                  <Typo.MD weight="bold">{title}</Typo.MD>
                )}
                {description ? (
                  <Tooltip text={description}>
                    <HelpCircle size="15" />
                  </Tooltip>
                ) : null}
              </Stack>
              {newItemLink ||
              deleteAction ||
              iconButtons ||
              selection ||
              sideText ? (
                <Stack align="center" width="auto">
                  {selection ? (
                    <SimpleSelect
                      options={selection.options}
                      onChange={(newSelectionValue: string) => {
                        setSelectionValue(newSelectionValue);
                        selection.onChange(newSelectionValue);
                      }}
                      value={selectionValue}
                    />
                  ) : null}
                  {sideText ? (
                    <Typo.SM color="muted" as="span" textStyle="italic">
                      {sideText}
                    </Typo.SM>
                  ) : null}
                  {iconButtons
                    ? iconButtons.map(({ action, label, icon }) => (
                        <SoftButton
                          key={icon || label}
                          action={action}
                          label={label}
                          icon={icon}
                        />
                      ))
                    : null}
                  {newItemLink ? (
                    <SoftButton action={newItemLink} icon="add" />
                  ) : null}
                  {deleteAction && !isLoading ? (
                    <StyledDeleteButton
                      onDelete={deleteAction.action}
                      shouldConfirmAlert={deleteAction.shouldConfirmAlert}
                      isMakingDeleteRequest={deleteAction.isMakingDeleteRequest}
                    />
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          </StyledCardHeader>
        ) : null}
        {children ? <StyledCardBody>{children}</StyledCardBody> : null}
      </StyledCard>
    </>
  );
}
