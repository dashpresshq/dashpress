import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
} from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { IEntityField, ITableTab } from "shared/types";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { Row, Col } from "styled-bootstrap-grid";
import { useFieldArray } from "react-final-form-arrays";
import {
  DeleteButton,
  FormButton,
  FormInput,
  FormSelect,
  SoftButton,
  Spacer,
  Stack,
  Tabs,
} from "@hadmean/chromista";
import React, { useState } from "react";

interface IProps {
  values: ITableTab[];
  entityFields: IEntityField[];
}

function TabForm({ values, entityFields }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");
  return (
    <>
      <Stack justify="end">
        <SoftButton
          icon="add"
          label="Add new tab"
          action={() => {
            const newTab: ITableTab = {
              title: `Tab ${fields.length + 1}`,
              filters: [],
              orderBy: "desc",
              sortBy: "",
            };
            fields.push(newTab);
            setCurrentTab(`Tab ${fields.length + 1}`);
          }}
        />
      </Stack>
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
                      setCurrentTab(`Tab ${index}`);
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
                <Row>
                  <Col md={6} sm={12}>
                    <Field name={`${field}.sortBy`} validateFields={[]}>
                      {({ meta, input }) => (
                        <FormSelect
                          label="Sort By"
                          meta={meta}
                          input={input}
                          selectData={[
                            ...entityFields.map(({ name }) => ({
                              value: name,
                              label: name,
                            })),
                          ]}
                        />
                      )}
                    </Field>
                  </Col>
                  <Col md={6} sm={12}>
                    <Field name={`${field}.orderBy`} validateFields={[]}>
                      {({ meta, input }) => (
                        <FormSelect
                          label="Direction"
                          meta={meta}
                          disabled={!fields.value[index].sortBy}
                          input={input}
                          selectData={[
                            {
                              label: "Descending",
                              value: "desc",
                            },
                            {
                              label: "Ascending",
                              value: "asc",
                            },
                          ]}
                        />
                      )}
                    </Field>
                  </Col>
                </Row>
              </>
            ),
            label: `Tab ${index + 1}`,
            overrideLabel: fields.value[index]?.title,
          }))}
        />
      )}
    </>
  );
}

export function EntityTableTabForm({
  onSubmit,
  initialValues,
  entityFields,
}: IFormProps<ITableTab[]> & { entityFields: IEntityField[] }) {
  return (
    <Form
      onSubmit={({ tabs }) => onSubmit(tabs)}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ tabs: initialValues }}
      render={({ handleSubmit, values, pristine }) => {
        return (
          <>
            <TabForm values={values.tabs} entityFields={entityFields} />
            <Spacer />
            <FormButton
              isMakingRequest={false}
              onClick={handleSubmit}
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
