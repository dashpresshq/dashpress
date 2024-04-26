import { IPaginatedDataState, ITableView } from "shared/types/data";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useFieldArray } from "react-final-form-arrays";
import { useState } from "react";
import { ACTIONS_ACCESSOR } from "frontend/views/data/Table/useTableColumns";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { generateRandomString } from "shared/lib/strings/random";
import {
  composeValidators,
  maxLength,
  required,
} from "frontend/lib/validations";
import { IFormProps } from "frontend/lib/form/types";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Table } from "frontend/design-system/components/Table";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Tabs } from "frontend/design-system/components/Tabs";
import { ActionButtons } from "frontend/design-system/components/Button/ActionButtons";
import { DELETE_BUTTON_PROPS } from "frontend/design-system/components/Button/constants";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { msg } from "@lingui/macro";

interface IProps {
  values: ITableView[];
  initialValues: ITableView[];
  tableColumns: ITableColumn[];
}

const TABLE_VIEW_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Table Views`,
  singular: msg`Table View`,
});

const makeViewId = (index: number) => `View ${index}`;

function TabForm({ tableColumns, values, initialValues }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");

  const columns = tableColumns.filter(
    ({ accessor }) => ACTIONS_ACCESSOR !== accessor
  );

  return (
    <>
      <Stack $justify="end">
        <SoftButton
          systemIcon="Plus"
          label={TABLE_VIEW_CRUD_CONFIG.TEXT_LANG.CREATE}
          action={() => {
            const newTab: ITableView = {
              id: generateRandomString(12),
              title: makeViewId(fields.length + 1),
              dataState: {
                filters: [],
                pageSize: undefined,
                sortBy: [],
              },
            };
            fields.push(newTab);
            setCurrentTab(makeViewId(fields.length + 1));
          }}
        />
      </Stack>
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
                  <Stack $justify="end">
                    <ActionButtons
                      size="xs"
                      actionButtons={[
                        {
                          ...DELETE_BUTTON_PROPS({
                            action: () => {
                              fields.remove(index);
                              setCurrentTab(makeViewId(index));
                            },
                            label: TABLE_VIEW_CRUD_CONFIG.TEXT_LANG.DELETE,
                            isMakingRequest: false,
                            shouldConfirmAlert: undefined,
                          }),
                        },
                      ]}
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
              id: makeViewId(index + 1),
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
            <Spacer />

            <FormButton
              isMakingRequest={submitting}
              onClick={handleSubmit}
              text={
                MAKE_APP_CONFIGURATION_CRUD_CONFIG("table_views").FORM_LANG
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
