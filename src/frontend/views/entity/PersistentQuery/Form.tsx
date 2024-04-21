import { QueryFilterSchema } from "shared/types/data";
import { Form, Field, useField } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { ACTIONS_ACCESSOR } from "frontend/views/data/Table/useTableColumns";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { composeValidators, required } from "frontend/lib/validations";
import { IFormProps } from "frontend/lib/form/types";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { DELETE_BUTTON_PROPS } from "frontend/design-system/components/Button/constants";
import { FormSelect } from "frontend/design-system/components/Form/FormSelect";
import { FormSelectButton } from "frontend/design-system/components/Form/FormSelectButton";
import { FormGrid } from "frontend/components/SchemaForm/form-grid";
import { Card, CardBody } from "frontend/design-system/components/Card";
import { Fragment } from "react";
import { FILTER_OPERATOR_CONFIG } from "./constants";

const OPERATOR_SELECTORS = ["and", "or"].map((option) => ({
  value: `${option}`,
  label: `${option.toLocaleUpperCase()}`,
}));

const filterOperatorSelections = Object.entries(FILTER_OPERATOR_CONFIG)
  .filter(([, value]) => !value.disabled)
  .map(([key, value]) => ({ value: key, label: value.label }));

function FilterRow({
  queryFilter,
  columns,
}: {
  queryFilter: string;
  columns: ITableColumn[];
}) {
  const operatorValue = useField(`${queryFilter}.value.operator`).input.value;

  const noValue = FILTER_OPERATOR_CONFIG[operatorValue]?.numberOfInput === 0;

  return (
    <div style={{ width: "100%" }}>
      <FormGrid.Root>
        <Field
          name={`${queryFilter}.id`}
          validate={composeValidators(required)}
          validateFields={[]}
        >
          {({ meta, input }) => (
            <FormGrid.Item $span="3">
              <FormSelect
                label="Field"
                required
                selectData={columns.map((column) => ({
                  value: column.accessor,
                  label: column.Header as string,
                }))}
                meta={meta}
                input={input}
              />
            </FormGrid.Item>
          )}
        </Field>

        <Field
          name={`${queryFilter}.value.operator`}
          validate={composeValidators(required)}
          validateFields={[]}
        >
          {({ meta, input }) => (
            <FormGrid.Item $span={noValue ? "9" : "3"}>
              <FormSelect
                label="Operator"
                required
                selectData={filterOperatorSelections}
                meta={meta}
                input={input}
              />
            </FormGrid.Item>
          )}
        </Field>
        {noValue ? null : (
          <Field
            name={`${queryFilter}.value.value`}
            validate={composeValidators(required)}
            validateFields={[]}
          >
            {({ meta, input }) => (
              <FormGrid.Item $span="6">
                <FormInput label="Value" required meta={meta} input={input} />
              </FormGrid.Item>
            )}
          </Field>
        )}
      </FormGrid.Root>
    </div>
  );
}

export function EntityPersistentQueryForm({
  onSubmit,
  initialValues,
  tableColumns,
}: IFormProps<QueryFilterSchema> & { tableColumns: ITableColumn[] }) {
  const columns = tableColumns.filter(
    ({ accessor, filter }) => ACTIONS_ACCESSOR !== accessor && filter
  );

  return (
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={initialValues}
      render={({ handleSubmit, pristine, submitting }) => {
        return (
          <>
            <FieldArray name="children">
              {({ fields: queryFields }) => (
                <div>
                  {queryFields.map((name, queryFieldIndex) => (
                    <Fragment key={name}>
                      {queryFields.length > 1 && queryFieldIndex !== 0 && (
                        <Field name="operator" validateFields={[]}>
                          {({ input, meta }) => (
                            <FormSelectButton
                              label=""
                              required
                              sm
                              selectData={OPERATOR_SELECTORS}
                              meta={meta}
                              input={input}
                            />
                          )}
                        </Field>
                      )}
                      <Card>
                        <CardBody>
                          <FieldArray name={`${name}.children`}>
                            {({ fields: queryFilters }) => (
                              <div>
                                {queryFilters.map(
                                  (queryFilter, queryFilterIndex) => (
                                    <div key={queryFilter}>
                                      {queryFilters.length > 1 &&
                                        queryFilterIndex !== 0 && (
                                          <Field
                                            name={`${name}.operator`}
                                            validateFields={[]}
                                          >
                                            {({ input, meta }) => (
                                              <FormSelectButton
                                                label=""
                                                sm
                                                required
                                                selectData={OPERATOR_SELECTORS}
                                                meta={meta}
                                                input={input}
                                              />
                                            )}
                                          </Field>
                                        )}
                                      <Stack $align="center">
                                        <FilterRow
                                          queryFilter={queryFilter}
                                          columns={columns}
                                        />
                                        <SoftButton
                                          justIcon
                                          {...DELETE_BUTTON_PROPS({
                                            action: () => {
                                              if (queryFilters.length === 1) {
                                                queryFields.remove(
                                                  queryFieldIndex
                                                );
                                                return;
                                              }
                                              queryFilters.remove(
                                                queryFilterIndex
                                              );
                                            },
                                            label: "Remove Nested Filter",
                                            isMakingRequest: false,
                                            shouldConfirmAlert: undefined,
                                          })}
                                        />
                                      </Stack>
                                    </div>
                                  )
                                )}
                                <SoftButton
                                  systemIcon="Plus"
                                  label="Add Nested Filter"
                                  action={() =>
                                    queryFilters.push({
                                      id: "",
                                      value: {
                                        operator: undefined,
                                        value: "",
                                      },
                                    })
                                  }
                                />
                              </div>
                            )}
                          </FieldArray>
                        </CardBody>
                      </Card>
                      <Spacer />
                    </Fragment>
                  ))}
                  <Spacer />
                  <Stack $justify="end">
                    <SoftButton
                      systemIcon="Plus"
                      label="Add Filter"
                      action={() =>
                        queryFields.push({
                          operator: "and",
                          children: [
                            {
                              id: "",
                              value: {
                                operator: undefined,
                                value: "",
                              },
                            },
                          ],
                        })
                      }
                    />
                  </Stack>
                </div>
              )}
            </FieldArray>
            <Spacer />
            <FormButton
              isMakingRequest={submitting}
              onClick={handleSubmit}
              text={
                MAKE_APP_CONFIGURATION_CRUD_CONFIG("persistent_query").FORM_LANG
                  .UPSERT
              }
              disabled={pristine}
              systemIcon="Save"
            />
          </>
        );
      }}
    />
  );
}
