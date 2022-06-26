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
import { FieldValidationCanvas } from "./FieldsValidation";

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
  types: Record<string, unknown>;
  selections: Record<string, unknown>;
  validations: Record<string, unknown>;
}

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
      render={({ handleSubmit, submitting, values }) => {
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
                    {(renderProps) => (
                      <FormSelect
                        label={getEntityFieldLabels(name)}
                        selectData={ENTITY_TYPES_SELECTION_BAG_AS_SELECTION}
                        rightAction={{
                          label: "Configure Validation",
                          action: () => {
                            setShowFieldValidations(name);
                          },
                        }}
                        disabledOptions={listOfEntitiesThatCantBeChanged}
                        disabled={listOfEntitiesThatCantBeChanged.includes(
                          renderProps.input.value
                        )}
                        {...renderProps}
                      />
                    )}
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
              onClose={() => setShowFieldValidations("")}
              show={!!showFieldValidations}
            >
              <FieldValidationCanvas
              // field={showFieldValidations}
              // values={values}
              // onSubmit={() => {}}
              />
            </OffCanvas>
          </>
        );
      }}
    />
  );
};
