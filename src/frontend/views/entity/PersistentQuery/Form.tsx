import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import arrayMutators from "final-form-arrays";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import type { IFormProps } from "frontend/lib/form/types";
import { composeValidators, required } from "frontend/lib/validations";
import { ACTIONS_ACCESSOR } from "frontend/views/data/Table/useTableColumns";
import { Fragment } from "react";
import { Field, Form, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import type { QueryFilterSchema } from "shared/types/data";

import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { FormButton } from "@/components/app/button/form";
import { SoftButton } from "@/components/app/button/soft";
import { FormSelect } from "@/components/app/form/input/select";
import { FormSelectButton } from "@/components/app/form/input/select-button";
import { FormInput } from "@/components/app/form/input/text";
import { FormGrid } from "@/components/app/form/schema/form-grid";
import { FILTER_OPERATOR_CONFIG } from "@/components/app/table/filters/constants";
import type { ITableColumn } from "@/components/app/table/types";
import { Card, CardContent } from "@/components/ui/card";

const OPERATOR_SELECTORS = [
  {
    value: "and",
    label: msg`AND`,
  },
  {
    value: "or",
    label: msg`OR`,
  },
];

const filterOperatorSelections = typescriptSafeObjectDotEntries(
  FILTER_OPERATOR_CONFIG
)
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
    <div className="w-full">
      <FormGrid.Root>
        <Field
          name={`${queryFilter}.id`}
          validate={composeValidators(required)}
          validateFields={[]}
        >
          {({ meta, input }) => (
            <FormGrid.Item span="3">
              <FormSelect
                label={msg`Field`}
                required
                selectData={columns.map((column) => ({
                  value: column.accessor,
                  label: column.Header as MessageDescriptor,
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
            <FormGrid.Item span={noValue ? "9" : "3"}>
              <FormSelect
                label={msg`Operator`}
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
              <FormGrid.Item span="6">
                <FormInput
                  label={msg`Value`}
                  required
                  meta={meta}
                  input={input}
                />
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
  const domainMessages = useAppConfigurationDomainMessages("persistent_query");

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
                              required
                              size="sm"
                              selectData={OPERATOR_SELECTORS}
                              meta={meta}
                              input={input}
                            />
                          )}
                        </Field>
                      )}
                      <Card className="mb-4">
                        <CardContent>
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
                                                size="sm"
                                                required
                                                selectData={OPERATOR_SELECTORS}
                                                meta={meta}
                                                input={input}
                                              />
                                            )}
                                          </Field>
                                        )}
                                      <div className="flex items-center gap-2">
                                        <FilterRow
                                          queryFilter={queryFilter}
                                          columns={columns}
                                        />
                                        <SoftButton
                                          size="icon"
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
                                            label: msg`Remove Nested Filter`,
                                            isMakingRequest: false,
                                            shouldConfirmAlert: undefined,
                                          })}
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                                <SoftButton
                                  systemIcon="Plus"
                                  label={msg`Add Nested Filter`}
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
                        </CardContent>
                      </Card>
                    </Fragment>
                  ))}
                  <div className="mt-2 flex justify-end">
                    <SoftButton
                      systemIcon="Plus"
                      label={msg`Add Filter`}
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
                  </div>
                </div>
              )}
            </FieldArray>
            <FormButton
              className="mt-3"
              isMakingRequest={submitting}
              onClick={handleSubmit}
              text={domainMessages.FORM_LANG.UPSERT}
              disabled={pristine}
              systemIcon="Save"
            />
          </>
        );
      }}
    />
  );
}
