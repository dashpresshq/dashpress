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
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { Check } from "react-feather";
import {
  isUseColorsFlagOn,
  SYSTEM_COLORS,
} from "shared/logic/entities/selection.utlis";
import { isBlackOrWhite } from "./isBlackOrWhite";

const StyledColorBox = styled.button<{ color: string }>`
  height: 24px;
  wifth: 24px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 0;
  padding-bottom: 0px;
  outline: none;
  border: 0;
  background: ${(props) => props.color};
`;

// Reference is a special case basically only use color

const ManagableEntities = ["selection"];

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
      render={({ handleSubmit, values, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          {entityType !== "boolean" && (
            <FormSwitch
              label="Use Colors"
              name="use-colors"
              value={useColors}
              onChange={(newUseColorValue) => {
                setUseColors(newUseColorValue);
                form.change(
                  "selections",
                  (
                    values as { selections: IColorableSelection[] }
                  ).selections.map((selection, index) => ({
                    ...selection,
                    color: newUseColorValue
                      ? SYSTEM_COLORS[index % SYSTEM_COLORS.length]
                      : undefined,
                  }))
                );
              }}
            />
          )}
          <FieldArray name="selections">
            {({ fields }) => (
              <div>
                {fields.map((name, index) => (
                  <React.Fragment key={name}>
                    {ManagableEntities.includes(entityType) && (
                      <>
                        <Spacer />
                        <Stack justify="end">
                          <DeleteButton
                            onDelete={() => {
                              fields.remove(index);
                            }}
                            shouldConfirmAlert={false}
                            text="Option"
                            size="xs"
                          />
                        </Stack>
                      </>
                    )}

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
                              <div key={systemColor}>
                                <StyledColorBox
                                  type="button"
                                  color={systemColor}
                                  onClick={() =>
                                    renderProps.input.onChange(systemColor)
                                  }
                                >
                                  <Check
                                    color={
                                      systemColor === renderProps.input.value
                                        ? isBlackOrWhite(systemColor)
                                        : systemColor
                                    }
                                    size="18"
                                  />
                                </StyledColorBox>
                              </div>
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
                  <>
                    <Spacer />
                    <SoftButton
                      icon="add"
                      label="Add new option"
                      action={() => {
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
                  </>
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
