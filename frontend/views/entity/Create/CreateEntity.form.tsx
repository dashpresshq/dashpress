import { FormButton } from "@gothicgeeks/design-system";
import { ButtonLang, resetFormValues } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
} from "../_RenderFormInput";
import { z } from "zod";
import { useMemo } from "react";
import get from "lodash/get";

export const CreateEntityForm: React.FC<
  IBaseEntityForm & IEntityFormSettings
> = ({
  onSubmit,
  fields,
  getEntityFieldLabels,
  entityFieldTypes,
  entityValidationsMap,
}) => {
  console.log(entityValidationsMap);

  const validationSchema = useMemo(() => {
    return z.object({
      question: z.string().max(10),
      answer: z.string().min(2),
    });
  }, []);

  return (
    <Form
      onSubmit={() => {}}
      validate={(values) => {
        const validation = validationSchema.safeParse(values);
        if (validation.success) {
          return {};
        }

        const error = get(validation, ["error"]).format();

        return Object.fromEntries(
          Object.entries(error).map(([key, error]) => [
            key,
            get(error, ["_errors", 0]),
          ])
        );
      }}
      render={({ handleSubmit, form, values, submitting }) => {
        return (
          <form
            noValidate={true}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                resetFormValues(
                  true,
                  values as Record<string, string>,
                  form as any
                );
              });
            }}
          >
            {fields.map(({ name }) => {
              return (
                <Field
                  key={name}
                  name={name}
                  // validate={composeValidators(required)}
                  validateFields={[]}
                >
                  {(renderProps) => (
                    <RenderFormInput
                      type={entityFieldTypes[name]}
                      label={getEntityFieldLabels(name)}
                      renderProps={renderProps}
                    />
                  )}
                </Field>
              );
            })}
            <FormButton text={ButtonLang.create} isMakingRequest={submitting} />
          </form>
        );
      }}
    />
  );
};

// Create new
// Settings After create go to settings/ go to table
