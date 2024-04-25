import * as React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { SchemaForm } from ".";

type IAccount = {
  name: string;
  email: string;
};

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

const buttonText = (isSubmitting: boolean) => ({
  id: "test",
  message: isSubmitting ? "Submitting Form" : "Submit Form",
});

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
  it("should submit valid form and persist value", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Mary",
      email: "mary@mail.com",
    });

    expect(screen.getByLabelText("Name")).toHaveValue("Mary");
    expect(screen.getByLabelText("Email")).toHaveValue("mary@mail.com");
  });

  it("should reset form state when resetForm is true", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
          resetForm
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalled();

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("should submit valid form on empty beforeSubmit", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
          formExtension={{
            beforeSubmit: "",
          }}
        />
      </ApplicationRoot>
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
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
          action="custom-action"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
          }}
        />
      </ApplicationRoot>
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

  it("should submit valid form on invalid beforeSubmit JS", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
          formExtension={{
            beforeSubmit: "sm ks ks dsldm sl dm",
          }}
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Mary");
    await userEvent.type(screen.getByLabelText("Email"), "mary@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Mary",
      email: "mary@mail.com",
    });
  });

  it("should throw error and not submit when beforeSubmit returns a string", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={BASE_FIELDS}
          action="custom-action"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
          }}
        />
      </ApplicationRoot>
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
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
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
      </ApplicationRoot>
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
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </ApplicationRoot>
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
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </ApplicationRoot>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Name"), "Hidden");

    expect(screen.queryByLabelText("Email")).not.toBeDisabled();

    await userEvent.type(screen.getByLabelText("Name"), "-");

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("should ignore form fields when it recieveds invalid JS", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: "sdmsd smd slmd s;ld sl",
          }}
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Hidden");
    await userEvent.type(screen.getByLabelText("Email"), "Hidden");

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      action: "edit",
      customEmail: "Hidden",
      customName: "Hidden",
    });
  });

  it("should show validation errors", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
          }}
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "f");
    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(
      "Name is required"
    );

    expect(screen.getAllByRole("alert")[1]).toHaveTextContent(
      "Email is required"
    );

    expect(mockOnSubmit).not.toHaveBeenCalledWith();

    await userEvent.type(screen.getByLabelText("Name"), "f");

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");

    expect(mockOnSubmit).not.toHaveBeenCalledWith();

    await userEvent.type(screen.getByLabelText("Email"), "f");

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    expect(mockOnSubmit).toHaveBeenCalledWith({ email: "f", name: "f" });
  });

  it("should use custom labels", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<{ name: string }>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            name: {
              type: "text",
              label: "Custom Name Label",
              validations: [],
            },
          }}
        />
      </ApplicationRoot>
    );

    await userEvent.type(
      screen.getByLabelText("Custom Name Label"),
      "some name"
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: "some name" });
  });

  it("should render * for required field", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<{ hello: string }>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
            hello: {
              type: "text",
              label: "Custom Name Label",
              validations: [],
            },
          }}
        />
      </ApplicationRoot>
    );

    expect(screen.getAllByText("*").length).toBe(2);
  });

  it("should have form button disabled by default", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<{ name: string }>
          onSubmit={mockOnSubmit}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            name: {
              type: "text",
              validations: [],
            },
          }}
        />
      </ApplicationRoot>
    );

    expect(screen.getByRole("button", { name: "Submit Form" })).toBeDisabled();
    await userEvent.type(screen.getByLabelText("Name"), "Foo");
    expect(
      screen.getByRole("button", { name: "Submit Form" })
    ).not.toBeDisabled();
  });

  it("should can onChange when fieldChanges", async () => {
    const onChangeMock = jest.fn();
    render(
      <ApplicationRoot>
        <SchemaForm<IAccount>
          onSubmit={jest.fn()}
          onChange={onChangeMock}
          buttonText={buttonText}
          systemIcon="Save"
          fields={{
            ...BASE_FIELDS,
          }}
          action="edit"
          formExtension={{
            beforeSubmit: BEFORE_SUBMIT,
            fieldsState: FIELD_STATE,
          }}
        />
      </ApplicationRoot>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Foo");

    expect(onChangeMock).toHaveBeenCalledTimes(6);
    expect(onChangeMock).toHaveBeenLastCalledWith({ name: "Foo" });
  });
});
