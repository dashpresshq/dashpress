import { FormNoValueSelect } from "@gothicgeeks/design-system";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { ENTITY_TYPES_SELECTION_BAG } from "shared/validations.constants";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

interface IProps {
  field: string;
  type: keyof typeof ENTITY_TYPES_SELECTION_BAG;
}

export const FieldValidationCanvas: React.FC<IProps> = ({ field, type }) => {
  const entity = useEntitySlug();

  if (!field) {
    return null;
  }

  const validations = [];

  const { allowedValidations } = ENTITY_TYPES_SELECTION_BAG[type];

  return (
    <>
      <Form
        onSubmit={(values) => {
          console.log(values);
        }}
        mutators={{
          // potentially other mutators could be merged here
          ...arrayMutators,
        }}
        initialValues={{ validations }}
        // validate={validate}
        render={({ handleSubmit, pristine, invalid, values }) => (
          <form onSubmit={handleSubmit}>
            <FieldArray name="validations">
              {({ fields }) => (
                <div>
                  {fields.map((name, index) => (
                    <div key={name}>
                      <div>
                        <label>
                          {JSON.stringify(
                            values.validations[index].validationType
                          )}
                        </label>
                      </div>
                      {
                        <div>
                          <label>Constraint</label>
                          <Field
                            name={`${name}.constraint`}
                            component="input"
                          />
                        </div>
                      }
                      <div>
                        <label>Error Message</label>
                        <Field
                          name={`${name}.errorMessage`}
                          component="input"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fields.remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <FormNoValueSelect
                    disabledOptions={[]}
                    onChange={(validationType) => {
                      fields.push({
                        validationType,
                        errorMessage: "Some default error message",
                      });
                    }}
                    selectData={allowedValidations.map((validation) => ({
                      label: validation,
                      value: validation,
                    }))}
                    // disabled={false} // disable when there is no more items to add
                  />
                </div>
              )}
            </FieldArray>
          </form>
        )}
      />
    </>
  );
};
