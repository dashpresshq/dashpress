/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { Field, Form } from "react-final-form";
import { action } from "@storybook/addon-actions";
import { required } from "frontend/lib/validations";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { Stack } from "frontend/design-system/primitives/Stack";
import { fakeMessageDescriptor } from "translations/fake";
import { FormCheckBox } from "./FormCheckBox";
import { FormInput } from "./FormInput";
import { FormNumberInput } from "./FormNumberInput";
import { FormRichTextArea } from "./FormRichTextArea";
import { FormButton } from "../Button/FormButton";
import { FormDateInput } from "./FormDateInput";
import { FormTextArea } from "./FormTextArea";
import { FormMultiSelect, FormSelect } from "./FormSelect";
import { FormCodeEditor } from "./FormCodeEditor";
import { AsyncFormSelect } from "./FormSelect/Async";
import { FormSwitch } from "./FormSwitch";
import { FormSearch } from "./FormSearch";
import { FormFileInput } from "./FormFileInput";
import { FormSelectButton } from "./FormSelectButton";
import { ActionButtons } from "../Button/ActionButtons";
import { DELETE_BUTTON_PROPS } from "../Button/constants";

function DemoForm() {
  return (
    <Form
      onSubmit={(values: unknown) => action(values as string)}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Field name="checkbox" validateFields={[]}>
            {(formProps) => (
              <FormCheckBox
                label={fakeMessageDescriptor("Example Checkbox Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="switch" validateFields={[]}>
            {(formProps) => (
              <FormSwitch
                name={formProps.input.name}
                value={formProps.input.value}
                onChange={formProps.input.onChange}
                label={fakeMessageDescriptor("Example Form Switch Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="checkbox-disabled" validateFields={[]}>
            {(formProps) => (
              <FormCheckBox
                disabled
                label={fakeMessageDescriptor("Disabled Example Checkbox Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="switch-disabled" validateFields={[]}>
            {(formProps) => (
              <FormSwitch
                name={formProps.input.name}
                disabled
                value={formProps.input.value}
                onChange={formProps.input.onChange}
                label={fakeMessageDescriptor(
                  "Disabled Example Form Switch Input"
                )}
                {...formProps}
              />
            )}
          </Field>

          <Field name="exampleText" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormInput
                label={fakeMessageDescriptor("Example Text Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="disabled" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormInput
                label={fakeMessageDescriptor("Disabled Text Input")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="requiredText" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormInput
                label={fakeMessageDescriptor("Required Text Input")}
                required
                {...formProps}
              />
            )}
          </Field>

          <Field name="descriptionText" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormInput
                description="Some Description here"
                label={fakeMessageDescriptor("With description")}
                {...formProps}
              />
            )}
          </Field>

          <Field
            name="rightActionInput"
            validateFields={[]}
            validate={required}
          >
            {(formProps) => (
              <FormInput
                rightActions={[
                  {
                    systemIcon: "ToggleLeft",
                    label: fakeMessageDescriptor("Please click me"),
                    action: action("right click actions"),
                  },
                ]}
                label={fakeMessageDescriptor("With right action")}
                {...formProps}
              />
            )}
          </Field>

          <Field
            name="rightMultipleActionInput"
            validateFields={[]}
            validate={required}
          >
            {(formProps) => (
              <FormInput
                rightActions={[
                  {
                    systemIcon: "ToggleLeft",
                    label: fakeMessageDescriptor("Please click me"),
                    action: action("right click actions"),
                  },
                  {
                    systemIcon: "ToggleLeft",
                    label: fakeMessageDescriptor("Please click me"),
                    action: action("right click actions"),
                  },
                ]}
                label={fakeMessageDescriptor("With multiple right action")}
                {...formProps}
              />
            )}
          </Field>

          <Field
            name="baseSelectButton"
            validateFields={[]}
            validate={required}
          >
            {(formProps) => (
              <FormSelectButton
                selectData={[
                  { label: "Wood", value: "wood" },
                  { label: "Bronze", value: "bronze" },
                  { label: "Silver", value: "silver" },
                  { label: "Gold", value: "gold" },
                ]}
                label={fakeMessageDescriptor("Example Select Button")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="baseSelectInput" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                ]}
                label={fakeMessageDescriptor("Example Select Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field
            name="diasbledSelectInput"
            validateFields={[]}
            validate={required}
          >
            {(formProps) => (
              <FormSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                ]}
                label={fakeMessageDescriptor("Disabled Select Input")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="asyncSelect" validateFields={[]} validate={required}>
            {(formProps) => (
              <AsyncFormSelect
                url="http://localhost:3000/roles"
                label={fakeMessageDescriptor("Async Select Input")}
                limit={2}
                {...formProps}
              />
            )}
          </Field>

          <Field name="foo7" validateFields={[]}>
            {(formProps) => (
              <FormMultiSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                  { label: "Baz", value: "baz" },
                  { label: "Noop", value: "noop" },
                  { label: "Dupe", value: "dupe" },
                ]}
                values={formProps.input.value || ["foo", "bar"]}
                onChange={formProps.input.onChange}
              />
            )}
          </Field>

          <Field name="file" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormFileInput
                label={fakeMessageDescriptor("Image")}
                required
                uploadUrl="http://localhost:3000/api/upload"
                {...formProps}
              />
            )}
          </Field>

          <Field name="dateInput" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormDateInput
                label={fakeMessageDescriptor("Example Date Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="dateInput" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormDateInput
                label={fakeMessageDescriptor("Disabled Date Input")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="numberInput" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormNumberInput
                label={fakeMessageDescriptor("Example Number Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="numberInput" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormNumberInput
                label={fakeMessageDescriptor("Disabled Number Input")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="textArea" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormTextArea
                label={fakeMessageDescriptor("Example Text Area Input")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="textArea" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormTextArea
                label={fakeMessageDescriptor("Disabled Text Area Input")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="richText" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormRichTextArea
                label={fakeMessageDescriptor("Example Rich Text")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="richText" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormRichTextArea
                label={fakeMessageDescriptor("Disabled Rich Text")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <Field name="code" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormCodeEditor
                language="javascript"
                label={fakeMessageDescriptor("Javascript")}
                {...formProps}
              />
            )}
          </Field>

          <Field name="code" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormCodeEditor
                language="javascript"
                label={fakeMessageDescriptor("Disabled Javascript")}
                {...formProps}
                disabled
              />
            )}
          </Field>

          <FormSearch onChange={() => {}} />

          <ActionButtons
            justIcons
            actionButtons={[
              {
                ...DELETE_BUTTON_PROPS({
                  action: () => action(""),
                  label: fakeMessageDescriptor("Delete Me"),
                  isMakingRequest: false,
                }),
              },
            ]}
          />
          <Stack $justify="flex-end">
            <FormButton
              text={(isSubmitting) =>
                fakeMessageDescriptor(
                  isSubmitting ? "Making Progress" : "Make Progress"
                )
              }
              systemIcon="Save"
              isMakingRequest
            />
            <FormButton
              text={(isSubmitting) =>
                fakeMessageDescriptor(
                  isSubmitting ? "Doing Something" : "Do Something"
                )
              }
              isMakingRequest={false}
              systemIcon="Save"
            />
          </Stack>
        </form>
      )}
    />
  );
}

export default {
  title: "Components/Form",
  component: DemoForm,
  args: {},
};

const Template: Story<{}> = (args) => (
  <ApplicationRoot>
    <DemoForm {...args} />
  </ApplicationRoot>
);

export const Default = Template.bind({});
Default.args = {};
