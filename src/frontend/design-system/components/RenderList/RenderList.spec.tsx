import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { RenderList } from ".";

import "@testing-library/jest-dom/extend-expect";

describe("RenderList", () => {
  it("should render list items", () => {
    render(
      <RenderList
        items={[
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
        ]}
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.getByText("Foo")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });

  it("should render computed labels", () => {
    render(
      <RenderList
        items={[
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
        ]}
        getLabel={(name) => `${name} + Label`}
        render={(item) => <div>{item.label}</div>}
      />
    );

    expect(screen.getByText("Foo + Label")).toBeInTheDocument();
    expect(screen.getByText("Bar + Label")).toBeInTheDocument();
  });

  it("should not render search input when items are small", () => {
    render(
      <RenderList
        items={[
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
        ]}
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.queryByPlaceholderText("Search")).not.toBeInTheDocument();
  });

  it("should render search input when items are large", () => {
    render(
      <RenderList
        items={Array.from({ length: 11 }, (_, i) => ({ name: `foo${i}` }))}
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should render not search input when items are large and list is declared `notSearchable`", () => {
    render(
      <RenderList
        items={Array.from({ length: 11 }, (_, i) => ({ name: `foo${i}` }))}
        notSearchable
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.queryByPlaceholderText("Search")).not.toBeInTheDocument();
  });

  it("should search items by label and name when search input is keyed", () => {
    render(
      <RenderList
        items={Array.from({ length: 11 }, (_, i) => ({ name: `foo${i}` }))}
        getLabel={(name) => `1-${name}`}
        render={(item) => <div>{item.label}</div>}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "foo1" },
    });

    expect(screen.queryByText("1-foo0")).not.toBeInTheDocument();
    expect(screen.getByText("1-foo1")).toBeInTheDocument();
    expect(screen.queryByText("No Search Results")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "something to not exist" },
    });

    expect(screen.queryByText("1-foo0")).not.toBeInTheDocument();
    expect(screen.queryByText("1-foo1")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "1-foo0" },
    });

    expect(screen.getByText("1-foo0")).toBeInTheDocument();
    expect(screen.queryByText("1-foo1")).not.toBeInTheDocument();

    expect(screen.queryByText("No Search Results")).not.toBeInTheDocument();
  });

  it("should render sorted list items by name", () => {
    render(
      <RenderList
        items={[
          {
            name: "Boo",
          },
          {
            name: "Zoo",
          },
          {
            name: "Aoo",
          },
        ]}
        sortByLabel
        render={(item) => <p role="alert">{item.name}</p>}
      />
    );

    const paragraphs = screen.getAllByRole("alert");
    expect(paragraphs[0]).toHaveTextContent("Aoo");
    expect(paragraphs[1]).toHaveTextContent("Boo");
    expect(paragraphs[2]).toHaveTextContent("Zoo");
  });

  it("should render sorted list items by label", () => {
    render(
      <RenderList
        items={[
          {
            name: "YY",
          },
          {
            name: "X",
          },
          {
            name: "ZZZ",
          },
        ]}
        getLabel={(name) => `${name.length} ${name}`}
        sortByLabel
        render={(item) => <p role="alert">{item.label}</p>}
      />
    );

    const paragraphs = screen.getAllByRole("alert");
    expect(paragraphs[0]).toHaveTextContent("1 X");
    expect(paragraphs[1]).toHaveTextContent("2 YY");
    expect(paragraphs[2]).toHaveTextContent("3 ZZZ");
  });

  it("should render skeleton when loading", () => {
    render(
      <RenderList
        items={[
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
        ]}
        isLoading={5}
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.getByTestId("list-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("Bar")).not.toBeInTheDocument();
  });

  it("should render error when present", () => {
    render(
      <RenderList
        items={[
          {
            name: "Foo",
          },
          {
            name: "Bar",
          },
        ]}
        error="Some nasty error"
        render={(item) => <div>{item.name}</div>}
      />
    );

    expect(screen.getByText("Some nasty error")).toBeInTheDocument();
    expect(screen.queryByText("Bar")).not.toBeInTheDocument();
  });

  it("should render Empty view when empty", () => {
    render(<RenderList items={[]} render={() => <div>foo</div>} />);

    expect(screen.getByText("No Item Has Been Added Yet")).toBeInTheDocument();
  });

  it("should render Empty view and `add new item` when empty and there is a newItemLink", () => {
    render(
      <RenderList
        items={[]}
        newItemLink="/add/new"
        singular="Product"
        render={() => <div>foo</div>}
      />
    );

    expect(
      screen.getByText("No Product Has Been Added Yet")
    ).toBeInTheDocument();
  });
});
