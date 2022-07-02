import {
  DeleteButton,
  Divider,
  FormButton,
  FormInput,
  FormSwitch,
  SoftButton,
  Spacer,
  Stack,
} from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { required, composeValidators, ButtonLang } from "@gothicgeeks/shared";
import React, { useState } from "react";
import styled from "styled-components";
import { IColorableSelection } from "./types";
import { isUseColorsFlagOn, SYSTEM_COLORS } from "./selection.utils";

export type EntityTypesForSelection =
  | "selection"
  | "selection-enum"
  | "reference"
  | "boolean";

// Reference is a special case basically only use color

const ManagableEntities = ["selection"];

interface IProps {
  field: string;
  selections: IColorableSelection[];
  entityType: EntityTypesForSelection;
  onSubmit: (values: IColorableSelection[]) => void;
}

export const FieldSelectionCanvas: React.FC<IProps> = ({
  field,
  onSubmit,
  entityType,
  selections,
}) => {
  const [useColors, setUseColors] = useState(isUseColorsFlagOn(selections));
  if (!field) {
    return null;
  }

  return (
    <>
      <Form
        onSubmit={(values: { selections: IColorableSelection[] }) => {
          onSubmit(values.selections);
        }}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={{ selections }}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <FormSwitch
              label="Use Colors"
              name="use-colors"
              value={useColors}
              onChange={(newUseColorValue) => {
                setUseColors(newUseColorValue);
                (
                  values as { selections: IColorableSelection[] }
                ).selections.map(({ color, ...rest }, index) => ({
                  ...rest,

                  color: newUseColorValue
                    ? SYSTEM_COLORS[index % SYSTEM_COLORS.length]
                    : undefined,
                }));
              }}
            />
            <FieldArray name="selections">
              {({ fields }) => {
                return (
                  <div>
                    {fields.map((name, index) => {
                      return (
                        <React.Fragment key={name}>
                          <Stack justify="space-between">
                            {ManagableEntities.includes(entityType) && (
                              <DeleteButton
                                onDelete={() => {
                                  fields.remove(index);
                                }}
                                shouldConfirmAlert={false}
                                text="Option"
                                size="xs"
                              />
                            )}
                          </Stack>
                          <Spacer />
                          <Field
                            name={`${name}.value`}
                            validate={composeValidators(required)}
                            validateFields={[]}
                          >
                            {(renderProps) => (
                              <FormInput
                                label="value"
                                required={true}
                                {...renderProps}
                              />
                            )}
                          </Field>
                          <Field
                            name={`${name}.label`}
                            validate={composeValidators(required)}
                            validateFields={[]}
                          >
                            {(renderProps) => (
                              <FormInput
                                label="label"
                                required={true}
                                {...renderProps}
                              />
                            )}
                          </Field>
                          {useColors && (
                            <Field
                              name={`${name}.color`}
                              validate={composeValidators(required)}
                              validateFields={[]}
                            >
                              {(renderProps) => (
                                <Stack>
                                  {SYSTEM_COLORS.map((systemColor) => (
                                    <StyledColorBox
                                      key={systemColor}
                                      background={systemColor}
                                      isActive={
                                        systemColor === renderProps.input.value
                                      }
                                    ></StyledColorBox>
                                  ))}
                                </Stack>
                              )}
                            </Field>
                          )}
                          <Spacer />
                          <Divider />
                        </React.Fragment>
                      );
                    })}
                    <SoftButton
                      icon="add"
                      label="Add new option"
                      onClick={() => {
                        fields.push({
                          label: "",
                          value: "",
                          color: useColors
                            ? SYSTEM_COLORS[
                                fields.length % SYSTEM_COLORS.length
                              ]
                            : undefined,
                        } as IColorableSelection);
                      }}
                    />
                  </div>
                );
              }}
            </FieldArray>
            <Spacer />
            <FormButton isMakingRequest={false} text={ButtonLang.upsert} />
          </form>
        )}
      />
    </>
  );
};

const StyledColorBox = styled.div<{ background: string; isActive: boolean }>`
width: 32px;
height: 32px;
${(props) => props.isActive && `border: 2px solid black`};
background ${(props) => props.background};
`;
