import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@adminator/chromista";
import { SchemaForm } from "./SchemaForm";

type IAccount = {
  name: string;
  password: string;
};

describe("<SchemaForm />", () => {
  it("should render form", async () => {
    render(
      <AppWrapper>
        <SchemaForm<IAccount>
          onSubmit={jest.fn()}
          buttonText="Submit Form"
          fields={{
            name: {
              type: "text",
              validations: [
                {
                  validationType: "required",
                },
              ],
            },
            password: {
              type: "password",
              validations: [
                {
                  validationType: "required",
                },
              ],
            },
          }}
        />
      </AppWrapper>
    );

    expect(screen.getByText("Submit Form")).toBeInTheDocument();
  });
});
