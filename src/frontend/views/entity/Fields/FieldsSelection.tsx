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
import { required, composeValidators } from "@hadmean/protozoa";
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
                            {OPTIONS_COLORS.map((systemColor) => (
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
                            ? OPTIONS_COLORS[
                                fields.length % OPTIONS_COLORS.length
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
            icon="save"
            isMakingRequest={false}
            text={CRUD_CONFIG.FORM_LANG.UPSERT(false)}
            loadingText={CRUD_CONFIG.FORM_LANG.UPSERT(true)}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
