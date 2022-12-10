import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import { SchemaForm } from ".";

type IAccount = {
  name: string;
  email: string;
};

jest.mock("next/router", () => require("next-router-mock"));

const BASE_FIELDS = {
  name: {
    type: "text" as const,
    validations: [
      {
        validationType: "required" as const,
      },
    ],
  },
  email: {
    type: "email" as const,
    validations: [
      {
        validationType: "required" as const,
      },
    ],
  },
};

const BEFORE_SUBMIT = `
  if($.formValues.name === "Invalid" && $.formValues.email === "invalid@email.com"){
    return \`A Custom Validation Failed\`;
  }

  return {
    customName: $.formValues.name,
    customEmail: $.formValues.email,
    action: $.action
  }
`;

const FIELD_STATE = `
  return {
    name: {
      hidden: $.formValues.email === "Hidden",
    },
    email: {
      disabled: $.formValues.name === "Disabled",
    }
  }
`;

describe("<SchemaForm />", () => {
  it("should submit valid form", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={BASE_FIELDS}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Mary",
      email: "mary@mail.com",
    });
  });

  it("should submit valid form on empty beforeSubmit", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={BASE_FIELDS}
          formExtension={{
            beforeSubmit: "",
          }}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Mary",
      email: "mary@mail.com",
    });
  });

  it("should submit values return by beforeSubmit", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={BASE_FIELDS}
          action="custom-action"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
          }}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    // TEST { routeParams: {}, auth: undefined }
    expect(mockOnSubmit).toHaveBeenCalledWith({
      customName: "Mary",
      customEmail: "mary@mail.com",
      action: "custom-action",
    });
  });

  it("should throw error and not submit when beforeSubmit returns a string", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={BASE_FIELDS}
          action="custom-action"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
          }}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Invalid");
    await userEvent.type(screen.getByLabelText("Email"), "invalid@email.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).not.toHaveBeenCalled();

    expect(await screen.findByRole("status")).toHaveTextContent(
      "A Custom Validation Failed"
    );
  });

  it("should edit forms", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={BASE_FIELDS}
          action="edit"
          initialValues={{
            name: "John Doe",
            email: "john@mail.com",
          }}
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
          }}
        />
      </AppWrapper>
    );

    expect(screen.getByLabelText("Name")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("john@mail.com");

    await userEvent.type(screen.getByLabelText("Name"), "Updated");
    await userEvent.type(screen.getByLabelText("Email"), "-updated");

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      action: "edit",
      customEmail: "john@mail.com-updated",
      customName: "John DoeUpdated",
    });
  });

  it("should disable form fields", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </AppWrapper>
    );

    expect(screen.getByLabelText("Email")).not.toBeDisabled();

    await userEvent.type(screen.getByLabelText("Name"), "Disabled");

    expect(screen.getByLabelText("Email")).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Name"), "-");

    expect(screen.getByLabelText("Email")).not.toBeDisabled();
  });

  it("should hide form fields", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText="Submit Form"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </AppWrapper>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Name"), "Hidden");

    expect(screen.queryByLabelText("Email")).not.toBeDisabled();

    await userEvent.type(screen.getByLabelText("Name"), "-");

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("should can onChange when fieldChanges", async () => {
    const onChangeMock = jest.fn();
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={jest.fn()}
          onChange={onChangeMock}
          buttonText="Submit Form"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Foo");

    expect(onChangeMock).toHaveBeenCalledTimes(6);
    expect(onChangeMock).toHaveBeenLastCalledWith({ name: "Foo" });
  });
});
