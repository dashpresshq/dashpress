import { IPaginatedDataState, ITableTab } from "shared/types/data";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useFieldArray } from "react-final-form-arrays";
import React, { useState } from "react";
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

interface IProps {
  values: ITableTab[];
  initialValues: ITableTab[];
  tableColumns: ITableColumn[];
}

function TabForm({ values, tableColumns, initialValues }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");

  const columns = tableColumns.filter(
    ({ accessor }) => ACTIONS_ACCESSOR !== accessor
  );

  const newTabButton = (
    <SoftButton
      systemIcon="Plus"
      label="Add New Tab"
      action={() => {
        const newTab: ITableTab = {
          id: generateRandomString(12),
          title: `Tab ${fields.length + 1}`,
          dataState: {
            filters: [],
            pageSize: undefined,
            sortBy: [],
          },
        };
        fields.push(newTab);
        setCurrentTab(`Tab ${fields.length + 1}`);
      }}
    />
  );

  return values.length > 0 ? (
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
              <Stack justify="end">
                <ActionButtons
                  size="xs"
                  actionButtons={[
                    {
                      ...DELETE_BUTTON_PROPS({
                        action: () => {
                          fields.remove(index);
                          setCurrentTab(`Tab ${index}`);
                        },
                        label: "Delete Tab",
                        isMakingRequest: false,
                      }),
                    },
                  ]}
                />

                {newTabButton}
              </Stack>
              <Spacer />
              <Field
                name={`${field}.title`}
                validate={composeValidators(required, maxLength(64))}
                validateFields={[]}
              >
                {({ meta, input }) => (
                  <FormInput label="Title" required meta={meta} input={input} />
                )}
              </Field>
              <Field name={`${field}.dataState`} validateFields={[]}>
                {({ input }) => (
                  <Table
                    {...{
                      tableData: {
                        error: false,
                        isLoading: false,
                        isPreviousData: false,
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
                    empty={{ text: "No Data" }}
                    columns={columns}
                  />
                )}
              </Field>
            </>
          ),
          label: `Tab ${index + 1}`,
          overrideLabel: fields.value[index]?.title,
        };
      })}
    />
  ) : (
    <Stack justify="end">{newTabButton}</Stack>
  );
}

export function EntityTableTabForm({
  onSubmit,
  initialValues,
  tableColumns,
}: IFormProps<ITableTab[]> & { tableColumns: ITableColumn[] }) {
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
            <FormButton
              isMakingRequest={submitting}
              onClick={handleSubmit}
              text={
                MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_views").FORM_LANG
                  .UPSERT
              }
              disabled={pristine}
              systemIcon="Save"
            />
            <Spacer />
            <TabForm
              values={values.tabs}
              initialValues={initialFormValues.tabs}
              tableColumns={tableColumns}
            />
          </>
        );
      }}
    />
  );
}
