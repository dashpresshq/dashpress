import {
  FormButton,
  FormSelect,
  FormSkeleton,
  FormSkeletonSchema,
  OffCanvas,
} from "@gothicgeeks/design-system";
import { IEntityField } from "../../../../../backend/entities/types";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  minLength,
} from "@gothicgeeks/shared";
import { ENTITY_TYPES_SELECTION_BAG } from "../../../../../shared/validations.constants";
import { useMemo, useState } from "react";
import {
  FieldValidationCanvas,
  IFieldValidationItem,
} from "./FieldsValidation";
import { getFieldTypeBoundedValidations } from "frontend/hooks/entity/guess";
import {
  EntityTypesForSelection,
  FieldSelectionCanvas,
} from "./FieldsSelection";
import { IColorableSelection } from "./types";

const ENTITY_TYPES_SELECTION_BAG_AS_SELECTION = Object.entries(
  ENTITY_TYPES_SELECTION_BAG
)
  .map(([key, { typeIsNotChangeAble }]) => ({
    label: key,
    value: key,
    order: typeIsNotChangeAble ? 1 : 2,
  }))
  .sort((a, b) => b.order - a.order);

const listOfEntitiesThatCantBeChanged = Object.entries(
  ENTITY_TYPES_SELECTION_BAG
)
  .filter(([_, value]) => value.typeIsNotChangeAble)
  .map(([key]) => key);

interface IValues {
  types: Record<string, keyof typeof ENTITY_TYPES_SELECTION_BAG>;
  selections: Record<string, IColorableSelection[]>;
  validations: Record<string, IFieldValidationItem[]>;
}

const resetBoundedValidation = (
  validations: IFieldValidationItem[],
  newType: keyof typeof ENTITY_TYPES_SELECTION_BAG
): IFieldValidationItem[] => {
  return [
    ...getFieldTypeBoundedValidations(newType),
    ...validations.filter(({ fromType }) => !fromType),
  ];
};

export const FieldsTypeForm: React.FC<{
  fields: IEntityField[];
  initialValues?: IValues;
  onSubmit: (data: IValues) => void;
  getEntityFieldLabels: (fieldName: string) => string;
  isLoading: boolean;
}> = ({ onSubmit, initialValues, fields, getEntityFieldLabels, isLoading }) => {
  const memoIzedInitialValuesSoItDoesFlickerOnSubmit = useMemo(() => {
    return initialValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialValues)]);

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
      render={({ handleSubmit, submitting, values, form }) => {
        return (
          <>
            <form onSubmit={handleSubmit}>
              {fields.map(({ name }) => {
                return (
                  <Field
                    key={name}
                    name={"types." + name}
                    validate={composeValidators(minLength(2), maxLength(64))}
                    validateFields={[]}
                  >
                    {(renderProps) => {
                      const rightActions = [
                        {
                          label: "Configure Selections",
                          action: () => {
                            setShowFieldSelection(name);
                          },
                        },
                      ];

                      if (
                        ENTITY_TYPES_SELECTION_BAG[
                          renderProps.input
                            .value as keyof typeof ENTITY_TYPES_SELECTION_BAG
                        ].configureSelection
                      ) {
                        rightActions.push({
                          label: "Configure Validation",
                          action: () => {
                            setShowFieldValidations(name);
                          },
                        });
                      }
                      return (
                        <FormSelect
                          label={
                            getEntityFieldLabels(name) +
                            " [" +
                            values.validations[name]
                              .map(({ validationType }) => validationType)
                              .join(",") +
                            "]"
                          }
                          selectData={ENTITY_TYPES_SELECTION_BAG_AS_SELECTION}
                          rightActions={rightActions}
                          disabledOptions={listOfEntitiesThatCantBeChanged}
                          disabled={listOfEntitiesThatCantBeChanged.includes(
                            renderProps.input.value
                          )}
                          meta={renderProps.meta}
                          input={{
                            ...renderProps.input,
                            onChange: (value) => {
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
                );
              })}
              <FormButton
                text={ButtonLang.upsert}
                isMakingRequest={submitting}
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
                  values[`types`][
                    showFieldValidations
                  ] as keyof typeof ENTITY_TYPES_SELECTION_BAG
                }
                validations={values.validations[showFieldValidations] || []}
                onSubmit={(value) => {
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
                  values[`types`][showFieldSelection] as EntityTypesForSelection
                }
                selections={values.selections[showFieldSelection] || []}
                onSubmit={(value) => {
                  form.change("selections", {
                    ...values.selections,
                    [showFieldSelection]: value,
                  });
                  setShowFieldSelection("");
                }}
              />
            </OffCanvas>
          </>
        );
      }}
    />
  );
};

const CANVAS_WIDTH = 500;
