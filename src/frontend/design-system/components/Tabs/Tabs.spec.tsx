import { render, fireEvent, screen } from "@testing-library/react";
import { Tabs } from ".";

const TAB_CONTENT = [
  {
    label: { message: `Foo Label`, id: "foo-label" },
    content: <>Foo Content</>,
  },
  {
    label: { message: `Bar Label`, id: "bar-label" },
    content: <>Bar Content</>,
  },
  {
    label: { message: `Baz Label`, id: "baz-label" },
    content: <>Baz Content</>,
  },
];

describe("Tabs", () => {
  it("should render first tab by default", () => {
    render(<Tabs contents={TAB_CONTENT} />);

    expect(screen.getByText("Foo Content")).toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();
  });

  it("should render first tab when current tab is loading", () => {
    render(<Tabs currentTab={undefined} contents={TAB_CONTENT} />);

    expect(screen.getByText("Foo Content")).toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();
  });

  it("should render currentTab", () => {
    render(<Tabs currentTab="Baz Label" contents={TAB_CONTENT} />);

    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();
  });

  it("should switch tab", async () => {
    const onChange = jest.fn();
    render(
      <Tabs onChange={onChange} currentTab="Baz Label" contents={TAB_CONTENT} />
    );
    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();

    expect(
      screen.getByRole("tabpanel", { name: "Baz Label" })
    ).toHaveTextContent("Baz Content");

    fireEvent.click(screen.getByText("Bar Label"));

    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();

    expect(
      screen.getByRole("tabpanel", { name: "Bar Label" })
    ).toHaveTextContent("Bar Content");

    expect(onChange).toHaveBeenCalled();
  });

  it("should not call onChange if current tab is pressed", async () => {
    const onChange = jest.fn();
    render(
      <Tabs onChange={onChange} currentTab="Baz Label" contents={TAB_CONTENT} />
    );
    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();

    fireEvent.click(screen.getByText("Baz Label"));

    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();

    expect(onChange).not.toHaveBeenCalled();
  });
});
