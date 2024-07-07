import { msg } from "@lingui/macro";
import arrayMutators from "final-form-arrays";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import { useFieldArray } from "react-final-form-arrays";

import { ActionButtons } from "@/components/app/button/action";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { FormButton } from "@/components/app/button/form";
import { SoftButton } from "@/components/app/button/soft";
import { FormInput } from "@/components/app/form/input/text";
import { Table } from "@/components/app/table";
import type { ITableColumn } from "@/components/app/table/types";
import { Tabs } from "@/components/app/tabs";
import { useAppConfigurationDomainMessages } from "@/frontend/hooks/configuration/configuration.constant";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import type { IFormProps } from "@/frontend/lib/form/types";
import {
  composeValidators,
  maxLength,
  required,
} from "@/frontend/lib/validations";
import { ACTIONS_ACCESSOR } from "@/frontend/views/data/Table/useTableColumns";
import { generateRandomString } from "@/shared/lib/strings/random";
import type { IPaginatedDataState, ITableView } from "@/shared/types/data";

interface IProps {
  values: ITableView[];
  initialValues: ITableView[];
  tableColumns: ITableColumn[];
}

const makeViewTitle = (index: number) => `View ${index}`;

function TabForm({ tableColumns, values, initialValues }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");
  const domainMessages = useDomainMessages({
    plural: msg`Table Views`,
    singular: msg`Table View`,
  });

  const columns = tableColumns.filter(
    ({ accessor }) => ACTIONS_ACCESSOR !== accessor
  );

  return (
    <>
      <div className="flex justify-end">
        <SoftButton
          systemIcon="Plus"
          label={domainMessages.TEXT_LANG.CREATE}
          action={() => {
            const newTab: ITableView = {
              id: generateRandomString(12),
              title: makeViewTitle(fields.length + 1),
              dataState: {
                filters: [],
                pageSize: undefined,
                sortBy: [],
              },
            };
            fields.push(newTab);
            setCurrentTab(newTab.id);
          }}
        />
      </div>
      {values.length > 0 && (
        <Tabs
          currentTab={currentTab}
          onChange={setCurrentTab}
          contents={fields.map((field, index) => {
            const dataState: Pick<
              IPaginatedDataState<unknown>,
              "filters" | "sortBy" | "pageSize"
            > = initialValues[index]?.dataState || {
              filters: [],
              pageSize: undefined,
              sortBy: [],
            };
            return {
              content: (
                <>
                  <div className="mb-3 flex justify-end">
                    <ActionButtons
                      size="sm"
                      actionButtons={[
                        {
                          ...DELETE_BUTTON_PROPS({
                            action: () => {
                              fields.remove(index);
                              if (fields.length > 0 && index > 0) {
                                setCurrentTab(fields.value[index - 1].id);
                              }
                            },
                            label: domainMessages.TEXT_LANG.DELETE,
                            isMakingRequest: false,
                            shouldConfirmAlert: undefined,
                          }),
                        },
                      ]}
                    />
                  </div>
                  <Field
                    name={`${field}.title`}
                    validate={composeValidators(required, maxLength(64))}
                    validateFields={[]}
                  >
                    {({ meta, input }) => (
                      <FormInput
                        label={msg`Title`}
                        required
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                  <Field name={`${field}.dataState`} validateFields={[]}>
                    {({ input }) => (
                      <Table
                        {...{
                          tableData: {
                            error: false,
                            isLoading: false,
                            isPlaceholderData: false,
                            data: {
                              data: [],
                              pageIndex: 0,
                              pageSize: 10,
                              totalRecords: 0,
                            },
                          },
                          syncPaginatedDataStateOut: input.onChange,
                          overridePaginatedDataState: {
                            ...dataState,
                            pageIndex: 0,
                          },
                        }}
                        empty={{ text: msg`No Data` }}
                        columns={columns}
                      />
                    )}
                  </Field>
                </>
              ),
              id: fields.value[index].id,
              label: msg`${fields.value[index]?.title}`,
            };
          })}
        />
      )}
    </>
  );
}

export function EntityTableTabForm({
  onSubmit,
  initialValues,
  tableColumns,
}: IFormProps<ITableView[]> & { tableColumns: ITableColumn[] }) {
  const domainMessages = useAppConfigurationDomainMessages("table_views");

  return (
    <Form
      onSubmit={({ tabs }) => onSubmit(tabs)}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ tabs: initialValues }}
      render={({
        handleSubmit,
        values,
        initialValues: initialFormValues,
        pristine,
        submitting,
      }) => {
        return (
          <>
            <TabForm
              values={values.tabs}
              initialValues={initialFormValues.tabs}
              tableColumns={tableColumns}
            />

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
