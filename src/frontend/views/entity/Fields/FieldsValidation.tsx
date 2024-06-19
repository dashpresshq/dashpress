import {
  FIELD_TYPES_CONFIG_MAP,
  ENTITY_VALIDATION_CONFIG,
} from "shared/validations";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import {
  FormFieldTypes,
  IFieldValidationItem,
  ValidationTypes,
} from "shared/validations/types";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import {
  composeValidators,
  maxLength,
  required,
} from "frontend/lib/validations";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { fakeMessageDescriptor } from "translations/fake";
import { SectionBox } from "@/components/app/section-box";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { Select } from "@/components/ui/select";
import { FormButton } from "@/components/app/button/form";
import { FormInput } from "@/components/app/form/input/text";
import { FormNumberInput } from "@/components/app/form/input/number";

interface IProps {
  field: string;
  validations: IFieldValidationItem[];
  entityType: FormFieldTypes;
  onSubmit: (values: IFieldValidationItem[]) => void;
}

const ERROR_MESSAGE_LENGTH = 128;

export function FieldValidationCanvas({
  field,
  onSubmit,
  entityType,
  validations,
}: IProps) {
  const domainMessages =
    useAppConfigurationDomainMessages("entity_validations");

  if (!field) {
    return null;
  }

  const { allowedValidations } = FIELD_TYPES_CONFIG_MAP[entityType];

  return (
    <Form
      onSubmit={(values: { validations: IFieldValidationItem[] }) => {
        onSubmit(
          values.validations.map((validation) => ({
            ...validation,
            errorMessage: fakeMessageDescriptor(
              validation.errorMessage.message
            ),
          }))
        );
      }}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ validations }}
      render={({ handleSubmit, values, pristine }) => (
        <form onSubmit={handleSubmit}>
          <div className="mt-2 flex flex-col gap-3">
            <FieldArray name="validations">
              {({ fields }) => (
                <>
                  {fields.map((name, index) => {
                    const { validationType, fromSchema }: IFieldValidationItem =
                      values.validations[index];

                    const { input: validationInput, isBoundToType } =
                      ENTITY_VALIDATION_CONFIG[validationType];

                    return (
                      <SectionBox
                        key={name}
                        title={ENTITY_VALIDATION_CONFIG[validationType].label}
                        actionButtons={
                          !isBoundToType && !fromSchema
                            ? [
                                DELETE_BUTTON_PROPS({
                                  label: msg`Remove`,
                                  action: () => fields.remove(index),
                                  isMakingRequest: false,
                                }),
                              ]
                            : []
                        }
                      >
                        {validationInput && (
                          <>
                            {typescriptSafeObjectDotEntries(
                              validationInput
                            ).map(([inputKey, inputValue]) => (
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
                                      label={msg`${userFriendlyCase(inputKey)}`}
                                      meta={meta}
                                      input={input}
                                    />
                                  ) : (
                                    <FormNumberInput
                                      required
                                      label={msg`${userFriendlyCase(inputKey)}`}
                                      meta={meta}
                                      input={input}
                                    />
                                  )
                                }
                              </Field>
                            ))}
                          </>
                        )}
                        <Field
                          name={`${name}.errorMessage.message`}
                          validate={composeValidators(
                            required,
                            maxLength(ERROR_MESSAGE_LENGTH)
                          )}
                          validateFields={[]}
                        >
                          {({ meta, input }) => (
                            <FormInput
                              label={msg`Error message`}
                              required
                              meta={meta}
                              input={input}
                            />
                          )}
                        </Field>
                      </SectionBox>
                    );
                  })}
                  <Select
                    onChange={(validationType: ValidationTypes) => {
                      const validationItem: IFieldValidationItem = {
                        validationType,
                        errorMessage:
                          ENTITY_VALIDATION_CONFIG[validationType].message,
                        constraint: {},
                      };
                      fields.push(validationItem);
                    }}
                    name="select-validation"
                    value=""
                    options={allowedValidations.map((validation) => ({
                      label: ENTITY_VALIDATION_CONFIG[validation].label,
                      value: validation,
                    }))}
                    placeholder={msg`Add New Validation`}
                    disabledOptions={(
                      values.validations as IFieldValidationItem[]
                    ).map(({ validationType }) => validationType)}
                  />
                </>
              )}
            </FieldArray>
            <FormButton
              isMakingRequest={false}
              text={domainMessages.FORM_LANG.UPSERT}
              systemIcon="Save"
              disabled={pristine}
            />
          </div>
        </form>
      )}
    />
  );
}
