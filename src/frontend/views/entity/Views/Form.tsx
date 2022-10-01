import {
  ButtonLang,
  composeValidators,
  maxLength,
  IFormProps,
  required,
} from "@hadmean/protozoa";
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
import {
  ACTIONS_ACCESSOR,
  useTableColumns,
} from "frontend/views/data/Table/useTableColumns";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { nanoid } from "nanoid";

interface IProps {
  values: ITableTab[];
}

function TabForm({ values }: IProps) {
  const { fields } = useFieldArray("tabs");
  const [currentTab, setCurrentTab] = useState("");
  const entity = useEntitySlug();
  const columns$1 = useTableColumns(entity);

  const columns = columns$1.filter(
    ({ accessor }) => ACTIONS_ACCESSOR !== accessor
  );

  const newTabButton = (
    <SoftButton
      icon="add"
      label="Add new tab"
      action={() => {
        const newTab: ITableTab = {
          id: nanoid(),
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
                // TODO implement, `isNull`, `isNotNull`, `currentUser`
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
  ) : (
    <Stack justify="end">{newTabButton}</Stack>
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
      render={({ handleSubmit, values, pristine, submitting }) => {
        return (
          <>
            <FormButton
              isMakingRequest={submitting}
              onClick={handleSubmit}
              text={`${ButtonLang.upsert} Changes`}
              disabled={pristine}
            />
            <Spacer />
            <TabForm values={values.tabs} />
          </>
        );
      }}
    />
  );
}
