import {
  FIELD_TYPES_CONFIG_MAP,
  ENTITY_VALIDATION_CONFIG,
} from "shared/validations";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import React from "react";
import {
  IFieldValidationItem,
  ValidationTypes,
} from "shared/validations/types";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import {
  composeValidators,
  maxLength,
  required,
} from "frontend/lib/validations";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { FormNumberInput } from "frontend/design-system/components/Form/FormNumberInput";
import { FormNoValueSelect } from "frontend/design-system/components/Form/FormSelect";
import { FormButton } from "frontend/design-system/components/Button/FormButton";

interface IProps {
  field: string;
  validations: IFieldValidationItem[];
  entityType: keyof typeof FIELD_TYPES_CONFIG_MAP;
  onSubmit: (values: IFieldValidationItem[]) => void;
}

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_validations");

const ERROR_MESSAGE_LENGTH = 128;

// TODO: for contributors: Show the actuall error message not the template message

export function FieldValidationCanvas({
  field,
  onSubmit,
  entityType,
  validations,
}: IProps) {
  if (!field) {
    return null;
  }

  const { allowedValidations } = FIELD_TYPES_CONFIG_MAP[entityType];

  return (
    <Form
      onSubmit={(values: { validations: IFieldValidationItem[] }) => {
        onSubmit(values.validations);
      }}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ validations }}
      render={({ handleSubmit, values, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Spacer size="sm" />
          <FieldArray name="validations">
            {({ fields }) => (
              <>
                {fields.map((name, index) => {
                  const { validationType, fromSchema }: IFieldValidationItem =
                    values.validations[index];

                  const { input: validationInput, isBoundToType } =
                    ENTITY_VALIDATION_CONFIG[validationType];

                  return (
                    <React.Fragment key={name}>
                      <SectionBox
                        title={userFriendlyCase(validationType)}
                        actionButtons={
                          !isBoundToType && !fromSchema
                            ? [
                                {
                                  _type: "delete",
                                  shouldConfirmAlert: false,
                                  action: () => fields.remove(index),
                                  isMakingDeleteRequest: false,
                                },
                              ]
                            : []
                        }
                      >
                        {validationInput && (
                          <>
                            {Object.entries(validationInput).map(
                              ([inputKey, inputValue]) => (
                                <Field
                                  key={inputKey}
                                  name={`${name}.constraint.${inputKey}`}
                                  validate={composeValidators(required)}
                                  validateFields={[]}
                                >
                                  {({ meta, input }) =>
                                    typeof inputValue === "string" ? (
                                      <FormInput
                                        required
                                        label={userFriendlyCase(inputKey)}
                                        meta={meta}
                                        input={input}
                                      />
                                    ) : (
                                      <FormNumberInput
                                        required
                                        label={userFriendlyCase(inputKey)}
                                        meta={meta}
                                        input={input}
                                      />
                                    )
                                  }
                                </Field>
                              )
                            )}
                          </>
                        )}
                        <Field
                          name={`${name}.errorMessage`}
                          validate={composeValidators(
                            required,
                            maxLength(ERROR_MESSAGE_LENGTH)
                          )}
                          validateFields={[]}
                        >
                          {({ meta, input }) => (
                            <FormInput
                              label="Error message"
                              required
                              meta={meta}
                              input={input}
                            />
                          )}
                        </Field>
                      </SectionBox>
                      <Spacer />
                    </React.Fragment>
                  );
                })}
                <FormNoValueSelect
                  disabledOptions={(
                    values.validations as IFieldValidationItem[]
                  ).map(({ validationType }) => validationType)}
                  defaultLabel="Add New Validation"
                  onChange={(validationType: ValidationTypes) => {
                    const validationItem: IFieldValidationItem = {
                      validationType,
                      errorMessage:
                        ENTITY_VALIDATION_CONFIG[validationType].message,
                      constraint: {},
                    };
                    fields.push(validationItem);
                  }}
                  selectData={allowedValidations.map((validation) => ({
                    label: validation,
                    value: validation,
                  }))}
                />
              </>
            )}
          </FieldArray>
          <Spacer />
          <FormButton
            isMakingRequest={false}
            text={CRUD_CONFIG.FORM_LANG.UPSERT}
            icon="save"
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
