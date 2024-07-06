import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IntermediateCheckBox } from ".";

describe("IntermediateCheckBox", () => {
  it("should render checked state correctly", () => {
    render(
      <IntermediateCheckBox state="checked" onClick={jest.fn} label="Test " />
    );

    expect(screen.getByRole("checkbox", { name: "Test" })).toBeChecked();
  });

  it("should render un-checked state correctly", () => {
    render(
      <IntermediateCheckBox state="unchecked" onClick={jest.fn} label="Test " />
    );

    expect(screen.getByRole("checkbox", { name: "Test" })).not.toBeChecked();
  });

  it("should render partial state correctly", () => {
    render(
      <IntermediateCheckBox state="partial" onClick={jest.fn} label="Test " />
    );

    expect(
      screen.getByRole("checkbox", { name: "Test" })
    ).toBePartiallyChecked();
  });

  it("should call onClick with the correct state when pressed", async () => {
    const onClick = jest.fn();
    render(
      <IntermediateCheckBox state="partial" onClick={onClick} label="Test " />
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "Test" }));

    expect(onClick).toHaveBeenCalledWith("partial");
  });
});
