/* eslint-disable react/function-component-definition */
import React from "react";
import { Story } from "@storybook/react";
import { Field, Form } from "react-final-form";
import { action } from "@storybook/addon-actions";
import { required } from "@hadmean/protozoa";
import { ApplicationRoot } from "../../ApplicationRoot";
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
import { DeleteButton } from "../Button";
import { FormSearch } from "./FormSearch";
import { FormFileInput } from "./FormFileInput";
import { Stack } from "../../primitives";
import { FormSelectButton } from "./FormSelectButton";

function DemoForm() {
  return (
    <Form
      onSubmit={(values: unknown) => action(values as string)}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Field name="checkbox" validateFields={[]}>
            {(renderProps) => (
              <FormCheckBox label="Example Checkbox Input" {...renderProps} />
            )}
          </Field>

          <Field name="switch" validateFields={[]}>
            {(renderProps) => (
              <FormSwitch
                name={renderProps.input.name}
                value={renderProps.input.value}
                onChange={renderProps.input.onChange}
                label="Example Form Switch Input"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="checkbox-disabled" validateFields={[]}>
            {(renderProps) => (
              <FormCheckBox
                disabled
                label="Disabled Example Checkbox Input"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="switch-disabled" validateFields={[]}>
            {(renderProps) => (
              <FormSwitch
                name={renderProps.input.name}
                disabled
                value={renderProps.input.value}
                onChange={renderProps.input.onChange}
                label="Disabled Example Form Switch Input"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="exampleText" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormInput label="Example Text Input" {...renderProps} />
            )}
          </Field>

          <Field name="disabled" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormInput
                label="Disabled Text Input"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="requiredText" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormInput
                label="Required Text Input"
                required
                {...renderProps}
              />
            )}
          </Field>

          <Field name="descriptionText" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormInput
                description="Some Description here"
                label="With description"
                {...renderProps}
              />
            )}
          </Field>

          <Field
            name="rightActionInput"
            validateFields={[]}
            validate={required}
          >
            {(renderProps) => (
              <FormInput
                rightActions={[
                  {
                    label: "Please click me",
                    action: action("right click actions"),
                  },
                ]}
                label="With right action"
                {...renderProps}
              />
            )}
          </Field>

          <Field
            name="rightMultipleActionInput"
            validateFields={[]}
            validate={required}
          >
            {(renderProps) => (
              <FormInput
                rightActions={[
                  {
                    label: "Please click me",
                    action: action("right click actions"),
                  },
                  {
                    label: "Please click me 2",
                    action: action("right click actions"),
                  },
                ]}
                label="With multiple right action"
                {...renderProps}
              />
            )}
          </Field>

          <Field
            name="baseSelectButton"
            validateFields={[]}
            validate={required}
          >
            {(renderProps) => (
              <FormSelectButton
                selectData={[
                  { label: "Wood", value: "wood" },
                  { label: "Bronze", value: "bronze" },
                  { label: "Silver", value: "silver" },
                  { label: "Gold", value: "gold" },
                ]}
                label="Example Select Button"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="baseSelectInput" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                ]}
                label="Example Select Input"
                {...renderProps}
              />
            )}
          </Field>

          <Field
            name="diasbledSelectInput"
            validateFields={[]}
            validate={required}
          >
            {(renderProps) => (
              <FormSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                ]}
                label="Disabled Select Input"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="asyncSelect" validateFields={[]} validate={required}>
            {(renderProps) => (
              <AsyncFormSelect
                url="http://localhost:3000/roles"
                label="Async Select Input"
                limit={2}
                {...renderProps}
              />
            )}
          </Field>

          <Field name="foo7" validateFields={[]}>
            {(renderProps) => (
              <FormMultiSelect
                selectData={[
                  { label: "Foo", value: "foo" },
                  { label: "Bar", value: "bar" },
                  { label: "Baz", value: "baz" },
                  { label: "Noop", value: "noop" },
                  { label: "Dupe", value: "dupe" },
                ]}
                values={renderProps.input.value || ["foo", "bar"]}
                onChange={renderProps.input.onChange}
              />
            )}
          </Field>

          <Field name="file" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormFileInput
                label="Image"
                required
                uploadUrl="http://localhost:3000/api/upload"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="dateInput" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormDateInput label="Example Date Input" {...renderProps} />
            )}
          </Field>

          <Field name="dateInput" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormDateInput
                label="Disbaled Date Input"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="numberInput" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormNumberInput label="Example Number Input" {...renderProps} />
            )}
          </Field>

          <Field name="numberInput" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormNumberInput
                label="Disabled Number Input"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="textArea" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormTextArea label="Example Text Area Input" {...renderProps} />
            )}
          </Field>

          <Field name="textArea" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormTextArea
                label="Disabled Text Area Input"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="richText" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormRichTextArea label="Example Rich Text" {...renderProps} />
            )}
          </Field>

          <Field name="richText" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormRichTextArea
                label="Disabled Rich Text"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <Field name="code" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormCodeEditor
                language="javascript"
                label="Javascript"
                {...renderProps}
              />
            )}
          </Field>

          <Field name="code" validateFields={[]} validate={required}>
            {(renderProps) => (
              <FormCodeEditor
                language="javascript"
                label="Disabled Javascript"
                {...renderProps}
                disabled
              />
            )}
          </Field>

          <FormSearch onChange={() => {}} />

          <DeleteButton
            onDelete={action("")}
            isMakingDeleteRequest={false}
            text="Me"
          />
          <Stack justify="flex-end">
            <FormButton
              text={(isSubmitting) =>
                isSubmitting ? "Making Progress" : "Make Progress"
              }
              icon="save"
              isMakingRequest
            />
            <FormButton
              text={(isSubmitting) =>
                isSubmitting ? "Doing Something" : "Do Something"
              }
              isMakingRequest={false}
              icon="save"
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
