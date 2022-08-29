import {
  DeleteButton,
  Divider,
  FormButton,
  FormInput,
  FormNoValueSelect,
  FormNumberInput,
  Spacer,
  Stack,
  Text,
} from "@hadmean/chromista";
import {
  FIELD_TYPES_CONFIG_MAP,
  ENTITY_VALIDATION_CONFIG,
} from "shared/validations";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { userFriendlyCase } from "frontend/lib/strings";
import {
  required,
  composeValidators,
  maxLength,
  ButtonLang,
} from "@hadmean/protozoa";
import React from "react";
import { IFieldValidationItem } from "shared/validations/types";

interface IProps {
  field: string;
  validations: IFieldValidationItem[];
  entityType: keyof typeof FIELD_TYPES_CONFIG_MAP;
  onSubmit: (values: IFieldValidationItem[]) => void;
}

const ERROR_MESSAGE_LENGTH = 128;

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
          <FieldArray name="validations">
            {({ fields }) => (
              <div>
                {fields.map((name, index) => {
                  const { validationType, fromSchema }: IFieldValidationItem =
                    values.validations[index];

                  const { input: validationInput, isBoundToType } =
                    ENTITY_VALIDATION_CONFIG[validationType];

                  return (
                    <React.Fragment key={name}>
                      <Stack justify="space-between">
                        <b>{userFriendlyCase(validationType)}</b>
                        {!isBoundToType && !fromSchema && (
                          <DeleteButton
                            onDelete={() => {
                              fields.remove(index);
                            }}
                            shouldConfirmAlert={false}
                            text="Validation"
                            size="xs"
                          />
                        )}
                      </Stack>
                      <Spacer />
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
                            label=""
                            required
                            meta={meta}
                            input={input}
                          />
                        )}
                      </Field>
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
                                {({ meta, input }) => (
                                  <Stack justify="space-between" align="center">
                                    <Text>{userFriendlyCase(inputKey)}</Text>
                                    {typeof inputValue === "string" ? (
                                      <FormInput
                                        label=""
                                        required
                                        meta={meta}
                                        input={input}
                                      />
                                    ) : (
                                      <FormNumberInput
                                        label=""
                                        required
                                        meta={meta}
                                        input={input}
                                      />
                                    )}
                                  </Stack>
                                )}
                              </Field>
                            )
                          )}
                        </>
                      )}
                      <Spacer />
                      <Divider />
                      <Spacer />
                    </React.Fragment>
                  );
                })}
                <FormNoValueSelect
                  disabledOptions={(
                    values.validations as IFieldValidationItem[]
                  ).map(({ validationType }) => validationType)}
                  defaultLabel="Add New Validation"
                  onChange={(validationType) => {
                    fields.push({
                      validationType,
                      errorMessage:
                        ENTITY_VALIDATION_CONFIG[validationType].message,
                      constraint: {},
                    } as IFieldValidationItem);
                  }}
                  selectData={allowedValidations.map((validation) => ({
                    label: validation,
                    value: validation,
                  }))}
                />
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
