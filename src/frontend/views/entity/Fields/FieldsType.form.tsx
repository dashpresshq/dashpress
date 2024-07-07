import { msg } from "@lingui/macro";
import { useMemo, useState } from "react";
import { Field, Form } from "react-final-form";

import { FormButton } from "@/components/app/button/form";
import { FormSelect } from "@/components/app/form/input/select";
import { OffCanvas } from "@/components/app/off-canvas";
import { useAppConfigurationDomainMessages } from "@/frontend/hooks/configuration/configuration.constant";
import { getFieldTypeBoundedValidations } from "@/frontend/hooks/entity/guess";
import {
  composeValidators,
  maxLength,
  minLength,
} from "@/frontend/lib/validations";
import type { IFormInputRightAction } from "@/shared/form-schemas/types";
import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";
import type {
  EntityTypesForSelection,
  IColorableSelection,
} from "@/shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "@/shared/validations";
import type {
  FormFieldTypes,
  IFieldValidationItem,
} from "@/shared/validations/types";

import { FieldSelectionCanvas } from "./FieldsSelection";
import { FieldValidationCanvas } from "./FieldsValidation";

const FIELD_TYPES_CONFIG_MAP_AS_SELECTION = typescriptSafeObjectDotEntries(
  FIELD_TYPES_CONFIG_MAP
)
  .map(([key, { typeIsNotChangeAble, label }]) => ({
    label,
    value: key,
    order: typeIsNotChangeAble ? 1 : 2,
  }))
  .sort((a, b) => b.order - a.order);

const listOfEntitiesThatCantBeChanged = typescriptSafeObjectDotEntries(
  FIELD_TYPES_CONFIG_MAP
)
  .filter(([, value]) => value.typeIsNotChangeAble)
  .map(([key]) => key);

interface IValues {
  types: Record<string, FormFieldTypes>;
  selections: Record<string, IColorableSelection[]>;
  validations: Record<string, IFieldValidationItem[]>;
  validationsChanged: boolean;
  selectionsChanged: boolean;
  typesChanged: boolean;
}

const resetBoundedValidation = (
  validations: IFieldValidationItem[],
  newType: FormFieldTypes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialValues)]
  );

  const domainMessages = useAppConfigurationDomainMessages(
    "entity_columns_types"
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
                {(formProps) => {
                  let rightActions: IFormInputRightAction[] = [
                    {
                      systemIcon: "Settings",
                      label: msg`Configure Validation`,
                      action: () => {
                        setShowFieldValidations(name);
                      },
                    },
                  ];

                  if (
                    FIELD_TYPES_CONFIG_MAP[
                      formProps.input.value as FormFieldTypes
                    ]?.configureSelection
                  ) {
                    rightActions = [
                      {
                        systemIcon: "Settings",
                        label: msg`Configure Selections`,
                        action: () => {
                          setShowFieldSelection(name);
                        },
                      },
                      ...rightActions,
                    ];
                  }
                  return (
                    <FormSelect
                      label={msg`${getEntityFieldLabels(
                        name
                      )} [${values.validations[name]
                        .map(({ validationType }) => validationType)
                        .join(",")}]`}
                      placeholder={msg`Select ${getEntityFieldLabels(
                        name
                      )} Type`}
                      selectData={FIELD_TYPES_CONFIG_MAP_AS_SELECTION}
                      rightActions={rightActions}
                      disabledOptions={listOfEntitiesThatCantBeChanged}
                      disabled={listOfEntitiesThatCantBeChanged.includes(
                        formProps.input.value as FormFieldTypes
                      )}
                      meta={formProps.meta}
                      input={{
                        ...formProps.input,
                        onChange: (value) => {
                          form.change("typesChanged", true);
                          formProps.input.onChange(value);
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
              text={domainMessages.FORM_LANG.UPSERT}
              systemIcon="Save"
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
            title={msg`${getEntityFieldLabels(
              showFieldValidations
            )} Validations`}
            size="md"
            onClose={() => setShowFieldValidations("")}
            show={!!showFieldValidations}
          >
            <FieldValidationCanvas
              field={showFieldValidations}
              entityType={values.types[showFieldValidations] as FormFieldTypes}
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
            title={msg`${getEntityFieldLabels(showFieldSelection)} Selections`}
            size="md"
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
