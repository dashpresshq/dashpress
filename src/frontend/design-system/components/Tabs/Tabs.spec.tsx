import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { Tabs } from ".";

import "@testing-library/jest-dom/extend-expect";

describe("Tabs", () => {
  it("should render first tab by default", () => {
    render(
      <Tabs
        contents={[
          {
            label: "Foo Label",
            content: <>Foo Content</>,
          },
          {
            label: "Bar Label",
            content: <>Bar Content</>,
          },
          {
            label: "Baz Label",
            content: <>Baz Content</>,
          },
        ]}
      />
    );

    expect(screen.getByText("Foo Content")).toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();
  });

  it("should render first tab when current tab is loading", () => {
    render(
      <Tabs
        currentTab={SLUG_LOADING_VALUE}
        contents={[
          {
            label: "Foo Label",
            content: <>Foo Content</>,
          },
          {
            label: "Bar Label",
            content: <>Bar Content</>,
          },
          {
            label: "Baz Label",
            content: <>Baz Content</>,
          },
        ]}
      />
    );

    expect(screen.getByText("Foo Content")).toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();
  });

  it("should render currentTab", () => {
    render(
      <Tabs
        currentTab="Baz Label"
        contents={[
          {
            label: "Foo Label",
            content: <>Foo Content</>,
          },
          {
            label: "Bar Label",
            content: <>Bar Content</>,
          },
          {
            label: "Baz Label",
            content: <>Baz Content</>,
          },
        ]}
      />
    );

    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();
  });

  it("should switch tab", async () => {
    const onChange = jest.fn();
    render(
      <Tabs
        onChange={onChange}
        currentTab="Baz Label"
        contents={[
          {
            label: "Foo Label",
            content: <>Foo Content</>,
          },
          {
            label: "Bar Label",
            content: <>Bar Content</>,
          },
          {
            label: "Baz Label",
            content: <>Baz Content</>,
          },
        ]}
      />
    );
    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).not.toBeVisible();
    expect(screen.getByText("Baz Content")).toBeVisible();

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Baz Content");

    fireEvent.click(screen.getByText("Bar Label"));

    expect(screen.getByText("Foo Content")).not.toBeVisible();
    expect(screen.getByText("Bar Content")).toBeVisible();
    expect(screen.getByText("Baz Content")).not.toBeVisible();

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Bar Content");

    expect(onChange).toHaveBeenCalled();
  });

  it("should not call onChange if current tab is pressed", async () => {
    const onChange = jest.fn();
    render(
      <Tabs
        onChange={onChange}
        currentTab="Baz Label"
        contents={[
          {
            label: "Foo Label",
            content: <>Foo Content</>,
          },
          {
            label: "Bar Label",
            content: <>Bar Content</>,
          },
          {
            label: "Baz Label",
            content: <>Baz Content</>,
          },
        ]}
      />
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
