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
} from '@gothicgeeks/design-system';
import {
  ENTITY_TYPES_SELECTION_BAG,
  ENTITY_VALIDATION_CONFIG,
} from 'shared/validations.constants';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { userFriendlyCase } from 'frontend/lib/strings';
import {
  required,
  composeValidators,
  maxLength,
  ButtonLang,
} from '@gothicgeeks/shared';
import React from 'react';

export interface IFieldValidationItem {
  validationType: keyof typeof ENTITY_VALIDATION_CONFIG;
  errorMessage: string;
  fromSchema?: true;
  fromType?: true;
  constraint?: Record<string, string | number>;
}

interface IProps {
  field: string;
  validations: IFieldValidationItem[];
  entityType: keyof typeof ENTITY_TYPES_SELECTION_BAG;
  onSubmit: (values: IFieldValidationItem[]) => void;
}

const ERROR_MESSAGE_LENGTH = 128;

export const FieldValidationCanvas: React.FC<IProps> = ({
  field,
  onSubmit,
  entityType,
  validations,
}) => {
  if (!field) {
    return null;
  }

  const { allowedValidations } = ENTITY_TYPES_SELECTION_BAG[entityType];

  return (
    <Form
      onSubmit={(values: { validations: IFieldValidationItem[] }) => {
        onSubmit(values.validations);
      }}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ validations }}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <FieldArray name="validations">
            {({ fields }) => (
              <div>
                {fields.map((name, index) => {
                  const {
                    validationType,
                    fromSchema,
                  }: IFieldValidationItem = values.validations[index];

                  const { input: validationInput, isBoundToType } = ENTITY_VALIDATION_CONFIG[validationType];

                  return (
                    <React.Fragment key={name}>
                      <Stack justify="space-between">
                        <label>
                          <b>{userFriendlyCase(validationType)}</b>
                        </label>
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
                          maxLength(ERROR_MESSAGE_LENGTH),
                        )}
                        validateFields={[]}
                      >
                        {(renderProps) => (
                          <FormInput
                            label=""
                            required
                            {...renderProps}
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
                                {(renderProps) => (
                                  <Stack
                                    justify="space-between"
                                    align="center"
                                  >
                                    <Text>
                                      {userFriendlyCase(inputKey)}
                                    </Text>
                                    {typeof inputValue === 'string'
                                      ? (
                                        <FormInput
                                          label=""
                                          required
                                          {...renderProps}
                                        />
                                      )
                                      : (
                                        <FormNumberInput
                                          label=""
                                          required
                                          {...renderProps}
                                        />
                                      )}
                                  </Stack>
                                )}
                              </Field>
                            ),
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
          <FormButton isMakingRequest={false} text={ButtonLang.upsert} />
        </form>
      )}
    />
  );
};
