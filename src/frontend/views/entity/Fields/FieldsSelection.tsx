import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { composeValidators, required } from "frontend/lib/validations";
import { Fragment, useState } from "react";
import { isNotEmpty } from "class-validator";
import { EntityTypesForSelection, IColorableSelection } from "shared/types/ui";
import { isUseColorsFlagOn } from "shared/logic/entities/selection.utils";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { msg } from "@lingui/macro";
import { FormButton } from "@/components/app/button/form";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import { CardContent, Card } from "@/components/ui/card";
import { SPECTRUM_COLORS } from "@/components/ui/spectrum";
import { FormInput } from "@/components/app/form/input/text";
import { SoftButton } from "@/components/app/button/soft";
import { SpectrumColorInputField } from "@/components/app/form/input/spectrum";
import { FormSwitch } from "@/components/app/form/input/switch";

// Reference is a special case basically only use color

const ManagableEntities = ["selection"];

interface IProps {
  field: string;
  selections: IColorableSelection[];
  entityType: EntityTypesForSelection;
  onSubmit: (values: IColorableSelection[]) => void;
}

const replaceForIntialValues = (selections: IColorableSelection[]) => {
  return selections.map((selection) => ({
    ...selection,
    label: { ...selection.label, message: selection.label.values?.[0] },
  }));
};

const replaceForSubmission = (selections: IColorableSelection[]) => {
  return selections.map((selection) => ({
    ...selection,
    label: {
      ...selection.label,
      message: "{0}",
      values: { 0: selection.label.message },
    },
  }));
};

export function FieldSelectionCanvas({
  field,
  onSubmit,
  entityType,
  selections,
}: IProps) {
  const [useColors, setUseColors] = useState(isUseColorsFlagOn(selections));
  const domainMessages = useAppConfigurationDomainMessages("entity_selections");
  if (!field) {
    return null;
  }

  return (
    <Form
      onSubmit={(values: { selections: IColorableSelection[] }) => {
        onSubmit(replaceForSubmission(values.selections));
      }}
      mutators={{
        ...arrayMutators,
      }}
      initialValues={{ selections: replaceForIntialValues(selections) }}
      render={({ handleSubmit, values, pristine, form }) => (
        <form onSubmit={handleSubmit} className="mb-3">
          {entityType !== "boolean" && (
            <FormSwitch
              label={msg`Use Colors`}
              name="use-colors"
              value={useColors}
              onChange={(newUseColorValue) => {
                setUseColors(newUseColorValue);
                form.change(
                  "selections",
                  (
                    values as { selections: IColorableSelection[] }
                  ).selections.map((selection, index) => ({
                    ...selection,
                    color: newUseColorValue
                      ? SPECTRUM_COLORS[index % SPECTRUM_COLORS.length]
                      : undefined,
                  }))
                );
              }}
            />
          )}
          <FieldArray name="selections">
            {({ fields }) => (
              <>
                {fields.map((name, index) => (
                  <Fragment key={name}>
                    <Card className="mt-3">
                      <CardContent>
                        <Field
                          name={`${name}.value`}
                          validate={composeValidators((value) =>
                            isNotEmpty(value) ? undefined : "Required"
                          )}
                          validateFields={[]}
                        >
                          {({ meta, input }) => (
                            <FormInput
                              disabled={!ManagableEntities.includes(entityType)}
                              label={msg`Value`}
                              required={ManagableEntities.includes(entityType)}
                              input={input}
                              meta={meta}
                            />
                          )}
                        </Field>
                        <Field
                          name={`${name}.label.message`}
                          validate={required}
                          validateFields={[]}
                        >
                          {({ meta, input }) => (
                            <FormInput
                              label={msg`Label`}
                              required
                              input={input}
                              meta={meta}
                            />
                          )}
                        </Field>
                        <div className="flex justify-between">
                          {useColors ? (
                            <Field
                              name={`${name}.color`}
                              validate={required}
                              validateFields={[]}
                            >
                              {({ input, meta }) => (
                                <SpectrumColorInputField
                                  formInput={{ input, meta }}
                                />
                              )}
                            </Field>
                          ) : (
                            <div />
                          )}
                          {ManagableEntities.includes(entityType) && (
                            <SoftButton
                              size="icon"
                              {...DELETE_BUTTON_PROPS({
                                action: () => {
                                  fields.remove(index);
                                },
                                isMakingRequest: false,
                                label: msg`Delete Selection`,
                                shouldConfirmAlert: undefined,
                              })}
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Fragment>
                ))}

                <div className="flex justify-between mt-3">
                  {ManagableEntities.includes(entityType) && (
                    <SoftButton
                      systemIcon="Plus"
                      label={msg`Add New Option`}
                      size={null}
                      action={() => {
                        fields.push({
                          label: msg``,
                          value: "",
                          color: useColors
                            ? SPECTRUM_COLORS[
                                fields.length % SPECTRUM_COLORS.length
                              ]
                            : undefined,
                        } as IColorableSelection);
                      }}
                    />
                  )}

                  <FormButton
                    systemIcon="Save"
                    isMakingRequest={false}
                    text={domainMessages.FORM_LANG.UPSERT}
                    disabled={pristine}
                  />
                </div>
              </>
            )}
          </FieldArray>
        </form>
      )}
    />
  );
}
