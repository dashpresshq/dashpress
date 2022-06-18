import { AppLayout } from "../../_layouts/app";
import {
  FormButton,
  FormInput,
  SectionBox,
  SectionCenter,
} from "@gothicgeeks/design-system";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
  resetFormValues,
  TitleLang,
} from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import { IEntityField } from "../../../backend/entities/types";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntitySlug,
  useSelectedEntityColumns,
} from "../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";
import { useEntityDataCreationMutation } from "../../hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "./Configure/constants";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const entityDataCreationMutation = useEntityDataCreationMutation(entity);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD,
    EntityActionTypes.Fields,
  ]);
  const hiddenCreateColumns = useSelectedEntityColumns(
    "hidden_entity_create_columns"
  );

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        { label: "Create", value: NAVIGATION_LINKS.ENTITY.CREATE(entity) },
      ]}
      actionItems={actionItems}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          {hiddenCreateColumns.isLoading || entityScalarFields.isLoading ? (
            <>TODO Loading</>
          ) : (
            <CreateEntityForm
              onSubmit={entityDataCreationMutation.mutateAsync}
              fields={(entityScalarFields.data || []).filter(({ name }) =>
                !(hiddenCreateColumns.data || []).includes(name)
              )}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const CreateEntityForm: React.FC<{
  fields: IEntityField[];
  onSubmit: (data: Record<string, unknown>) => void;
}> = ({ onSubmit, fields }) => {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, values, submitting }) => {
        return (
          <form
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
                  // validate={composeValidators(required, maxLength(32))}
                  validateFields={[]}
                >
                  {(renderProps) => (
                    <FormInput label={name} required={true} {...renderProps} />
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
