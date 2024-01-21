import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { composeValidators, required } from "frontend/lib/validations";
import React, { useState } from "react";
import styled from "styled-components";
import { isNotEmpty } from "class-validator";
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { Check } from "react-feather";
import {
  isUseColorsFlagOn,
  OPTIONS_COLORS,
} from "shared/logic/entities/selection.utils";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Card, CardBody } from "frontend/design-system/components/Card";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { FormSwitch } from "frontend/design-system/components/Form/FormSwitch";
import { DELETE_BUTTON_PROPS } from "frontend/design-system/components/Button/constants";
import { isBlackOrWhite } from "./isBlackOrWhite";

const ColorBox = styled.button<{ color: string }>`
  height: 24px;
  wifth: 24px;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 0;
  cursor: pointer;
  padding-bottom: 0px;
  outline: none;
  border: 0;
  background: ${(props) => props.color};
`;

// Reference is a special case basically only use color

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_selections");

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
              size="sm"
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
                      ? OPTIONS_COLORS[index % OPTIONS_COLORS.length]
                      : undefined,
                  }))
                );
              }}
            />
          )}
          <FieldArray name="selections">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <React.Fragment key={name}>
                    <Card>
                      <CardBody>
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
                              label="Value"
                              required={ManagableEntities.includes(entityType)}
                              input={input}
                              meta={meta}
                            />
                          )}
                        </Field>
                        <Field
                          name={`${name}.label`}
                          validate={required}
                          validateFields={[]}
                        >
                          {({ meta, input }) => (
                            <FormInput
                              label="Label"
                              required
                              input={input}
                              meta={meta}
                            />
                          )}
                        </Field>
                        <Stack justify="space-between">
                          {useColors ? (
                            <Field
                              name={`${name}.color`}
                              validate={required}
                              validateFields={[]}
                            >
                              {(formProps) => (
                                <Stack>
                                  {OPTIONS_COLORS.map((systemColor) => (
                                    <div key={systemColor}>
                                      <ColorBox
                                        type="button"
                                        color={systemColor}
                                        onClick={() =>
                                          formProps.input.onChange(systemColor)
                                        }
                                      >
                                        <Check
                                          color={
                                            systemColor ===
                                            formProps.input.value
                                              ? isBlackOrWhite(systemColor)
                                              : systemColor
                                          }
                                          size="18"
                                        />
                                      </ColorBox>
                                    </div>
                                  ))}
                                </Stack>
                              )}
                            </Field>
                          ) : (
                            <div />
                          )}
                          {ManagableEntities.includes(entityType) && (
                            <SoftButton
                              size="xs"
                              justIcon
                              {...DELETE_BUTTON_PROPS({
                                action: () => {
                                  fields.remove(index);
                                },
                                isMakingRequest: false,
                                label: "Delete Selection",
                                shouldConfirmAlert: undefined,
                              })}
                            />
                          )}
                        </Stack>
                      </CardBody>
                    </Card>
                    <Spacer />
                  </React.Fragment>
                ))}

                <Spacer />
                <Stack justify="space-between">
                  {ManagableEntities.includes(entityType) && (
                    <SoftButton
                      systemIcon="Plus"
                      label="Add new option"
                      size={null}
                      action={() => {
                        fields.push({
                          label: "",
                          value: "",
                          color: useColors
                            ? OPTIONS_COLORS[
                                fields.length % OPTIONS_COLORS.length
                              ]
                            : undefined,
                        } as IColorableSelection);
                      }}
                    />
                  )}

                  <FormButton
                    systemIcon="Save"
                    isMakingRequest={false}
                    text={CRUD_CONFIG.FORM_LANG.UPSERT}
                    disabled={pristine}
                  />
                </Stack>
              </>
            )}
          </FieldArray>
        </form>
      )}
    />
  );
}
