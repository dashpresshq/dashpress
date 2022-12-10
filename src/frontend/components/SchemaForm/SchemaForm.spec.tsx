import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import { SchemaForm } from ".";

type IAccount = {
  name: string;
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
};

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

    await userEvent.type(screen.getByLabelText("Name"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Hello",
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

    await userEvent.type(screen.getByLabelText("Name"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Hello",
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
            beforeSubmit: `
              return {
                hello: $.formValues.name,
                action: $.action
              }
            `,
          }}
        />
      </AppWrapper>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: "Submit Form" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      hello: "Hello",
      action: "custom-action",
    });
  });
});
