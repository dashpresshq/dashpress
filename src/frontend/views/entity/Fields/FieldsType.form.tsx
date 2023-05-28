import { FormButton, FormSelect, OffCanvas } from "@hadmean/chromista";
import { Form, Field } from "react-final-form";
import { composeValidators, maxLength, minLength } from "@hadmean/protozoa";
import { useMemo, useState } from "react";
import { getFieldTypeBoundedValidations } from "frontend/hooks/entity/guess";
import { IFieldValidationItem } from "shared/validations/types";
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { FieldValidationCanvas } from "./FieldsValidation";
import { FieldSelectionCanvas } from "./FieldsSelection";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_columns_types");

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
}

export function FieldsTypeForm({
  onSubmit,
  initialValues,
  fields,
  getEntityFieldLabels,
}: IProps) {
  const memoIzedInitialValuesSoItDoesFlickerOnSubmit = useMemo(
    () => initialValues,
    [JSON.stringify(initialValues)]
  );

  const [showFieldValidations, setShowFieldValidations] = useState("");
  const [showFieldSelection, setShowFieldSelection] = useState("");

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
                  let rightActions = [
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
                    rightActions = [
                      {
                        label: "Configure Selections",
                        action: () => {
                          setShowFieldSelection(name);
                        },
                      },
                      ...rightActions,
                    ];
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
              text={CRUD_CONFIG.FORM_LANG.UPSERT(false)}
              loadingText={CRUD_CONFIG.FORM_LANG.UPSERT(false)}
              icon="save"
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
                handleSubmit();
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
                handleSubmit();
              }}
            />
          </OffCanvas>
        </>
      )}
    />
  );
}
