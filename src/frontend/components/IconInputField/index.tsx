import { Field } from "react-final-form";
import { SystemIconsList } from "shared/constants/Icons";
import { required } from "frontend/lib/validations";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { FormSelect } from "frontend/design-system/components/Form/FormSelect";
import { FormTextArea } from "frontend/design-system/components/Form/FormTextArea";

export function IconInputField({ value }: { value: string }) {
  return (
    <Field name="icon" validateFields={[]} validate={required}>
      {({ input, meta }) =>
        SystemIconsList.includes(value) ? (
          <FormSelect
            label="Icon"
            required
            selectData={SystemIconsList.map((icon) => ({
              value: icon,
              label: userFriendlyCase(icon),
            }))}
            meta={meta}
            input={input}
            rightActions={[
              {
                systemIcon: "ToggleLeft",
                label: "Use SVG",
                action: () => input.onChange(""),
              },
            ]}
          />
        ) : (
          <FormTextArea
            rows={10}
            description="Pass in valid SVG in here with the prop `fill='currentColor'`"
            label="SVG"
            required
            meta={meta}
            input={input}
            rightActions={[
              {
                systemIcon: "ToggleRight",
                label: "Use Icon",
                action: () => input.onChange(SystemIconsList[0]),
              },
            ]}
          />
        )
      }
    </Field>
  );
}
