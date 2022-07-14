import {
  FormButton,
  FormSelect,
  FormSkeleton,
  FormSkeletonSchema,
  OffCanvas,
} from "@gothicgeeks/design-system";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@gothicgeeks/shared";
import { useMemo, useState } from "react";
import { getFieldTypeBoundedValidations } from "frontend/hooks/entity/guess";
import { FIELD_TYPES_CONFIG_MAP } from "../../../../../shared/validations.constants";
import {
  FieldValidationCanvas,
  IFieldValidationItem,
} from "./FieldsValidation";
import {
  EntityTypesForSelection,
  FieldSelectionCanvas,
} from "./FieldsSelection";
import { IColorableSelection } from "./types";

const FIELD_TYPES_CONFIG_MAP_AS_SELECTION = Object.entries(
  FIELD_TYPES_CONFIG_MAP
)
  .map(([key, { typeIsNotChangeAble }]) => ({
    label: key,
    value: key,
    order: typeIsNotChangeAble ? 1 : 2,
  }))
  .sort((a, b) => b.order - a.order);

const listOfEntitiesThatCantBeChanged = Object.entries(FIELD_TYPES_CONFIG_MAP)
  .filter(([, value]) => value.typeIsNotChangeAble)
  .map(([key]) => key);

interface IValues {
  types: Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>;
  selections: Record<string, IColorableSelection[]>;
  validations: Record<string, IFieldValidationItem[]>;
  validationsChanged: boolean;
  selectionsChanged: boolean;
  typesChanged: boolean;
}

const CANVAS_WIDTH = 500;

const resetBoundedValidation = (
  validations: IFieldValidationItem[],
  newType: keyof typeof FIELD_TYPES_CONFIG_MAP
): IFieldValidationItem[] => [
  ...getFieldTypeBoundedValidations(newType),
  ...validations.filter(({ fromType }) => !fromType),
];

interface IProps {
  fields: string[];
  initialValues?: IValues;
  onSubmit: (data: IValues) => void;
  getEntityFieldLabels: (fieldName: string) => string;
  isLoading: boolean;
}

export function FieldsTypeForm({
  onSubmit,
  initialValues,
  fields,
  getEntityFieldLabels,
  isLoading,
}: IProps) {
  const memoIzedInitialValuesSoItDoesFlickerOnSubmit = useMemo(
    () => initialValues,
    [JSON.stringify(initialValues)]
  );

  const [showFieldValidations, setShowFieldValidations] = useState("");
  const [showFieldSelection, setShowFieldSelection] = useState("");

  if (isLoading) {
    return (
      <FormSkeleton
        schema={[
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Input,
          FormSkeletonSchema.Textarea,
        ]}
      />
    );
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={memoIzedInitialValuesSoItDoesFlickerOnSubmit}
      render={({ handleSubmit, submitting, values, form }) => (
        <>
          <form onSubmit={handleSubmit}>
            {fields.map((name) => (
              <Field
                key={name}
                name={`types.${name}`}
                validate={composeValidators(minLength(2), maxLength(64))}
                validateFields={[]}
              >
                {(renderProps) => {
                  const rightActions = [
                    {
                      label: "Configure Validation",
                      action: () => {
                        setShowFieldValidations(name);
                      },
                    },
                  ];

                  if (
                    FIELD_TYPES_CONFIG_MAP[
                      renderProps.input
                        .value as keyof typeof FIELD_TYPES_CONFIG_MAP
                    ].configureSelection
                  ) {
                    rightActions.push({
                      label: "Configure Selections",
                      action: () => {
                        setShowFieldSelection(name);
                      },
                    });
                  }
                  return (
                    <FormSelect
                      label={`${getEntityFieldLabels(
                        name
                      )} [${values.validations[name]
                        .map(({ validationType }) => validationType)
                        .join(",")}]`}
                      selectData={FIELD_TYPES_CONFIG_MAP_AS_SELECTION}
                      rightActions={rightActions}
                      disabledOptions={listOfEntitiesThatCantBeChanged}
                      disabled={listOfEntitiesThatCantBeChanged.includes(
                        renderProps.input.value
                      )}
                      meta={renderProps.meta}
                      input={{
                        ...renderProps.input,
                        onChange: (value) => {
                          form.change("typesChanged", true);
                          renderProps.input.onChange(value);
                          form.change("validations", {
                            ...values.validations,
                            [name]: resetBoundedValidation(
                              values.validations[name],
                              value
                            ),
                          });
                        },
                      }}
                    />
                  );
                }}
              </Field>
            ))}
            <FormButton
              text={ButtonLang.upsert}
              isMakingRequest={submitting}
              disabled={
                !(
                  values.selectionsChanged ||
                  values.typesChanged ||
                  values.validationsChanged
                )
              }
            />
          </form>
          <OffCanvas
            title={`"${getEntityFieldLabels(
              showFieldValidations
            )}" Validations`}
            width={CANVAS_WIDTH}
            onClose={() => setShowFieldValidations("")}
            show={!!showFieldValidations}
          >
            <FieldValidationCanvas
              field={showFieldValidations}
              entityType={
                values.types[
                  showFieldValidations
                ] as keyof typeof FIELD_TYPES_CONFIG_MAP
              }
              validations={values.validations[showFieldValidations] || []}
              onSubmit={(value) => {
                form.change("validationsChanged", true);
                form.change("validations", {
                  ...values.validations,
                  [showFieldValidations]: value,
                });
                setShowFieldValidations("");
              }}
            />
          </OffCanvas>
          <OffCanvas
            title={`"${getEntityFieldLabels(showFieldSelection)}" Selection`}
            width={CANVAS_WIDTH}
            onClose={() => setShowFieldSelection("")}
            show={!!showFieldSelection}
          >
            <FieldSelectionCanvas
              field={showFieldSelection}
              entityType={
                values.types[showFieldSelection] as EntityTypesForSelection
              }
              selections={values.selections[showFieldSelection] || []}
              onSubmit={(value) => {
                form.change("selectionsChanged", true);
                form.change("selections", {
                  ...values.selections,
                  [showFieldSelection]: value,
                });
                setShowFieldSelection("");
              }}
            />
          </OffCanvas>
        </>
      )}
    />
  );
}
