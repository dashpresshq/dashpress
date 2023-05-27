import {
  ButtonLang,
  composeValidators,
  maxLength,
  IFormProps,
  required,
  StringUtils,
  IPaginatedDataState,
} from "@hadmean/protozoa";
import { ITableTab } from "shared/types/data";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { useFieldArray } from "react-final-form-arrays";
import {
  DeleteButton,
  FormButton,
  FormInput,
  ITableColumn,
  SoftButton,
  Spacer,
  Stack,
  Table,
  Tabs,
} from "@hadmean/chromista";
import React, { useState } from "react";
import { ACTIONS_ACCESSOR } from "frontend/views/data/Table/useTableColumns";

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
      icon="add"
      label="Add New Tab"
      action={() => {
        const newTab: ITableTab = {
          id: StringUtils.generateRandomString(12),
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
                <DeleteButton
                  onDelete={() => {
                    fields.remove(index);
                    setCurrentTab(`Tab ${index}`);
                  }}
                  shouldConfirmAlert={false}
                  text="Tab"
                  size="xs"
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
              text={`${ButtonLang.upsert} Changes`}
              disabled={pristine}
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
