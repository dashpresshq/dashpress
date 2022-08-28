import {
  DeleteButton,
  Divider,
  FormButton,
  FormInput,
  FormSwitch,
  SoftButton,
  Spacer,
  Stack,
} from "@hadmean/chromista";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { required, composeValidators, ButtonLang } from "@hadmean/protozoa";
import React, { useState } from "react";
import styled from "styled-components";
import { isNotEmpty } from "class-validator";
import { IColorableSelection } from "shared/types";
import { isUseColorsFlagOn, SYSTEM_COLORS } from "./selection.utils";

export type EntityTypesForSelection =
  | "selection"
  | "selection-enum"
  | "boolean";

const StyledColorBox = styled.div<{ background: string; isActive: boolean }>`
  width: 32px;
  height: 32px;
  ${(props) => props.isActive && "border: 2px solid black"};
  background ${(props) => props.background};
  `;

// Reference is a special case basically only use color

const ManagableEntities = ["selection"];

// TODO color selection

interface IProps {
  field: string;
  selections: IColorableSelection[];
  entityType: EntityTypesForSelection;
  onSubmit: (values: IColorableSelection[]) => void;
}

export function FieldSelectionCanvas({
  field,
  onSubmit,
  entityType,
  selections,
}: IProps) {
  const [useColors, setUseColors] = useState(isUseColorsFlagOn(selections));
  if (!field) {
    return null;
  }

  return (
    <Form
      onSubmit={(values: { selections: IColorableSelection[] }) => {
        onSubmit(values.selections);
      }}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ selections }}
      render={({ handleSubmit, values, pristine }) => (
        <form onSubmit={handleSubmit}>
          <FormSwitch
            label="Use Colors"
            name="use-colors"
            value={useColors}
            onChange={(newUseColorValue) => {
              setUseColors(newUseColorValue);
              (values as { selections: IColorableSelection[] }).selections.map(
                (selection, index) => ({
                  ...selection,
                  color: newUseColorValue
                    ? SYSTEM_COLORS[index % SYSTEM_COLORS.length]
                    : undefined,
                })
              );
            }}
          />
          <FieldArray name="selections">
            {({ fields }) => (
              <div>
                {fields.map((name, index) => (
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
                      validate={composeValidators((value) =>
                        isNotEmpty(value) ? undefined : "Required"
                      )}
                      validateFields={[]}
                    >
                      {({ meta, input }) => (
                        <FormInput
                          disabled={!ManagableEntities.includes(entityType)}
                          label="value"
                          required={ManagableEntities.includes(entityType)}
                          input={input}
                          meta={meta}
                        />
                      )}
                    </Field>
                    <Field
                      name={`${name}.label`}
                      validate={composeValidators(required)}
                      validateFields={[]}
                    >
                      {({ meta, input }) => (
                        <FormInput
                          label="label"
                          required
                          input={input}
                          meta={meta}
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
                              />
                            ))}
                          </Stack>
                        )}
                      </Field>
                    )}
                    <Spacer />
                    <Divider />
                  </React.Fragment>
                ))}
                {ManagableEntities.includes(entityType) && (
                  <SoftButton
                    icon="add"
                    label="Add new option"
                    action={() => {
                      fields.push({
                        label: "",
                        value: "",
                        color: useColors
                          ? SYSTEM_COLORS[fields.length % SYSTEM_COLORS.length]
                          : undefined,
                      } as IColorableSelection);
                    }}
                  />
                )}
              </div>
            )}
          </FieldArray>
          <Spacer />
          <FormButton
            isMakingRequest={false}
            text={ButtonLang.upsert}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
