import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
} from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { ITableTab } from "shared/types";
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
  Table,
  Tabs,
} from "@hadmean/chromista";
import React, { useState } from "react";
import { useTableColumns } from "frontend/views/data/Table/useTableColumns";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";

interface IProps {
  values: ITableTab[];
}

function TabForm({ values }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");
  const entity = useEntitySlug();
  const columns = useTableColumns(entity);
  return (
    <>
      <Stack justify="end">
        <SoftButton
          icon="add"
          label="Add new tab"
          action={() => {
            const newTab: ITableTab = {
              title: `Tab ${fields.length + 1}`,
              dataState: { filters: [], pageSize: undefined, sortBy: [] },
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
                            totalRecords: 1,
                          },
                        },
                        setPaginatedDataState: input.onChange,
                        paginatedDataState: input.value,
                      }}
                      columns={columns}
                    />
                  )}
                </Field>
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
}: IFormProps<ITableTab[]>) {
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
            <TabForm values={values.tabs} />
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
