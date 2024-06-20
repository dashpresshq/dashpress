/* eslint-disable react/function-component-definition */

import { Story } from "@storybook/react";
import { Field, Form } from "react-final-form";
import { action } from "@storybook/addon-actions";
import { required } from "frontend/lib/validations";
import { fakeMessageDescriptor } from "translations/fake";
import { TestProviders } from "__tests__/_/Provider";
import { FormInput } from "./text";
import { FormNumberInput } from "./number";
import { FormRichTextArea } from "../../../../frontend/design-system/components/Form/RichText";
import { FormTextArea } from "./textarea";
import { FormMultiSelect } from "../../../../frontend/design-system/components/Form/Select";
import { FormCodeEditor } from "../../../../frontend/design-system/components/Form/CodeEditor";
import { FormSwitch } from "./switch";
import { FormFileInput } from "../../../../frontend/design-system/components/Form/File";
import { FormSelectButton } from "./select-button";
import { DELETE_BUTTON_PROPS } from "../../button/constants";
import { FormPasswordInput } from "./password";
import { FormButton } from "../../button/form";
import { ActionButtons } from "../../button/action";
import { FormDateInput } from "./date";
import { AsyncFormSelect } from "./select-async";
import { FormSelect } from "./select";

function DemoForm() {
  return (
    <Form
      onSubmit={(values: unknown) => action(values as string)}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
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

          <Field name="examplePassword" validateFields={[]} validate={required}>
            {(formProps) => (
              <FormPasswordInput
                label={fakeMessageDescriptor("Example Password Input")}
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
                  { label: fakeMessageDescriptor("Wood"), value: "wood" },
                  { label: fakeMessageDescriptor("Bronze"), value: "bronze" },
                  { label: fakeMessageDescriptor("Silver"), value: "silver" },
                  { label: fakeMessageDescriptor("Gold"), value: "gold" },
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
                  { label: fakeMessageDescriptor("Foo"), value: "foo" },
                  { label: fakeMessageDescriptor("Bar"), value: "bar" },
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
                  { label: fakeMessageDescriptor("Foo"), value: "foo" },
                  { label: fakeMessageDescriptor("Bar"), value: "bar" },
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
                  { label: fakeMessageDescriptor("Foo"), value: "foo" },
                  { label: fakeMessageDescriptor("Bar"), value: "bar" },
                  { label: fakeMessageDescriptor("Baz"), value: "baz" },
                  { label: fakeMessageDescriptor("Noop"), value: "noop" },
                  { label: fakeMessageDescriptor("Dupe"), value: "dupe" },
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

          <ActionButtons
            size="icon"
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
          <div className="flex justify-end">
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
          </div>
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
  <TestProviders>
    <DemoForm {...args} />
  </TestProviders>
);

export const Default = Template.bind({});
Default.args = {};
