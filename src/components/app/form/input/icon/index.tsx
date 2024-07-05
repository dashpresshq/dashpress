import { Field } from "react-final-form";
import type { SystemIconsKeys } from "shared/constants/Icons";
import { SystemIconsList } from "shared/constants/Icons";
import { required } from "frontend/lib/validations";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { msg } from "@lingui/macro";
import { FormTextArea } from "../textarea";
import { FormSelect } from "../select";

export function IconInputField() {
  return (
    <Field name="icon" validateFields={[]} validate={required}>
      {({ input, meta }) =>
        SystemIconsList.includes(input.value as SystemIconsKeys) ? (
          // TODO render the icons and add search
          <FormSelect
            label={msg`Icon`}
            required
            selectData={SystemIconsList.map((icon) => ({
              value: icon,
              label: msg`${userFriendlyCase(icon)}`,
            }))}
            meta={meta}
            input={input}
            rightActions={[
              {
                systemIcon: "ToggleLeft",
                label: msg`Use SVG`,
                action: () => input.onChange(""),
              },
            ]}
          />
        ) : (
          <FormTextArea
            rows={10}
            description="Pass in valid SVG in here with the prop `fill='currentColor'`"
            label={msg`SVG`}
            required
            meta={meta}
            input={input}
            rightActions={[
              {
                systemIcon: "ToggleRight",
                label: msg`Use Icon`,
                action: () => input.onChange(SystemIconsList[0]),
              },
            ]}
          />
        )
      }
    </Field>
  );
}
