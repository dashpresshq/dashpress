import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
} from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { QueryFilter } from "shared/types";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useFieldArray } from "react-final-form-arrays";
import {
  DeleteButton,
  FormButton,
  FormInput,
  SoftButton,
  Spacer,
  Stack,
  Tabs,
} from "@hadmean/chromista";
import React, { useState } from "react";

export type ITableTab = {
  title: string;
  filters: QueryFilter[];
};

interface IProps {
  values: ITableTab[];
}

function Foo({ values }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");
  return (
    <>
      <SoftButton
        icon="add"
        label="Add new tab"
        action={() => {
          fields.push({ title: `Tab ${fields.length + 1}`, filters: [] });
          console.log(fields.value[4].title);
          setCurrentTab(fields.value[fields.length]?.title);
        }}
      />
      {values.length > 0 && (
        <Tabs
          currentTab={currentTab}
          onChange={setCurrentTab}
          contents={fields.map((field, index) => ({
            content: (
              <>
                <Stack justify="end">
                  <DeleteButton
                    onDelete={() => {
                      fields.remove(index);
                      setCurrentTab(fields.value[index - 1]?.title);
                    }}
                    shouldConfirmAlert={false}
                    text="Tab"
                    size="xs"
                  />
                </Stack>
                <Spacer />
                <Field
                  name={`${field}.title`}
                  validate={composeValidators(required, maxLength(64))}
                  validateFields={[]}
                >
                  {({ meta, input }) => (
                    <FormInput
                      label="Title"
                      required
                      meta={meta}
                      input={input}
                    />
                  )}
                </Field>
              </>
            ),
            label: `Tab ${index + 1}`,
          }))}
        />
      )}
    </>
  );
}

export function EntityTableTabForm({
  onSubmit,
  initialValues,
}: IFormProps<ITableTab[]>) {
  return (
    <Form
      onSubmit={({ tab }) => onSubmit(tab)}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ tabs: initialValues }}
      render={({ handleSubmit, values, pristine }) => {
        return (
          <>
            <Foo values={values.tabs} />
            <FormButton
              isMakingRequest={false}
              onClick={() => handleSubmit(values.tabs)}
              text={ButtonLang.upsert}
              disabled={pristine}
            />
          </>
        );
      }}
    />
  );
}

/* <FieldArray name="filters">
            {({ fields }) => (
              <div>
                {fields.map((name) => {
                  //   const { validationType, fromSchema }: IFieldValidationItem =
                  //     values.validations[index];

                  return (
                    <React.Fragment key={name}>
                      <Field
                        name={`${name}.title`}
                        validate={composeValidators(required, maxLength(64))}
                        validateFields={[]}
                      >
                        {({ meta, input }) => (
                          <FormInput
                            label="Title"
                            required
                            meta={meta}
                            input={input}
                          />
                        )}
                      </Field> */
/* {validationInput && (
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
                      )} */
/* <Spacer />
                    </React.Fragment>
                  );
                })} */
/* <FormNoValueSelect
                  disabledOptions={(
                    values.validations as IFieldValidationItem[]
                  ).map(({ validationType }) => validationType)}
                  defaultLabel="Add New Field"
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
                /> */
/* </div>
            )}
          </FieldArray>
          <Spacer />
       */
