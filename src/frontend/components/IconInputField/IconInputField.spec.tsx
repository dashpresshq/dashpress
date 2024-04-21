import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import userEvent from "@testing-library/user-event";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { IconInputField } from ".";
import { ApplicationRoot } from "../ApplicationRoot";

function TestComponent({
  onSubmit,
  initialValues,
}: {
  onSubmit: () => void;
  initialValues: Record<string, string>;
}) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, pristine, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <IconInputField value={values?.icon} />

            <FormButton
              text={() => "Save"}
              systemIcon="Plus"
              isMakingRequest={false}
              disabled={pristine}
            />
          </form>
        );
      }}
    />
  );
}

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

describe("<IconInputField />", () => {
  it("should render text input only by default", async () => {
    const onSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <TestComponent onSubmit={onSubmit} initialValues={{}} />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("Icon")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("SVG"), "some test SVG");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { icon: "some test SVG" },
      expect.anything(),
      expect.anything()
    );
  });

  it("should render icon input only when valid icon is passed", async () => {
    const onSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <TestComponent
          onSubmit={onSubmit}
          initialValues={{ icon: "PieChart" }}
        />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("SVG")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Icon"), "Credit Card");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { icon: "CreditCard" },
      expect.anything(),
      expect.anything()
    );
  });

  it("should render text input when invalid icon is passed", async () => {
    const onSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <TestComponent
          onSubmit={onSubmit}
          initialValues={{ icon: "Some invalid icon" }}
        />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("Icon")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("SVG"), "-updated");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { icon: "Some invalid icon-updated" },
      expect.anything(),
      expect.anything()
    );
  });

  it("should be able to switch to icon input from text input", async () => {
    const onSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <TestComponent
          onSubmit={onSubmit}
          initialValues={{ icon: "Some invalid icon" }}
        />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("Icon")).not.toBeInTheDocument();
    expect(screen.getByLabelText("SVG")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Use Icon" }));

    expect(screen.queryByLabelText("SVG")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Icon"), "Credit Card");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { icon: "CreditCard" },
      expect.anything(),
      expect.anything()
    );
  });

  it("should be able to switch to text input from icon input", async () => {
    const onSubmit = jest.fn();
    render(
      <ApplicationRoot>
        <TestComponent
          onSubmit={onSubmit}
          initialValues={{ icon: "CreditCard" }}
        />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("SVG")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Icon")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Use SVG" }));

    expect(screen.queryByLabelText("Icon")).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("SVG"), "some custom icon");

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { icon: "some custom icon" },
      expect.anything(),
      expect.anything()
    );
  });
});
