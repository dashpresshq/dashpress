/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import EntityPersistentQuerySettings from "pages/admin/[entity]/config/persistent-query";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

setupApiHandlers();

describe("pages/admin/[entity]/config/persistent-query", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      query: {
        entity: "entity-1",
      },
    })
  );

  it("should save persistent queries", async () => {
    render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", {
        name: "Add Filter",
      })
    );

    await userEvent.type(
      await screen.findByLabelText("Field"),
      "entity-1-string-field"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(await screen.findByLabelText("Operator"), "Equal");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(await screen.findByLabelText("Value"), "equal-value");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Persistent Query",
      })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Persistent Query Saved Successfully"
    );
  });

  it("should display updated value", async () => {
    const { container } = render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    expect(
      container.querySelector(`input[name="children[0].children[0].id"]`)
    ).toHaveValue("entity-1-string-field");

    expect(
      container.querySelector(
        `input[name="children[0].children[0].value.operator"]`
      )
    ).toHaveValue("e");

    expect(
      container.querySelector(
        `input[name="children[0].children[0].value.value"]`
      )
    ).toHaveValue("equal-value");
  });

  it("should add nested filters", async () => {
    const { container } = render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", {
        name: "Add Nested Filter",
      })
    );

    await userEvent.type(
      screen.getAllByLabelText("Field")[1],
      "entity-1-date-field"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getAllByLabelText("Operator")[1], "Less Than");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getAllByLabelText("Value")[1],
      "less-than-value"
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Add Nested Filter",
      })
    );

    await userEvent.click(
      screen.getAllByRole("button", {
        name: "Remove Nested Filter",
      })[2]
    );

    expect(
      container.querySelector(`input[name="children[0].operator__and"]`)
    ).toBeChecked();

    expect(
      container.querySelector(`input[name="children[0].operator__or"`)
    ).not.toBeChecked();

    await userEvent.click(
      screen.getAllByRole("option", {
        name: "OR",
      })[0]
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Persistent Query",
      })
    );
  });

  it("should add more filter blocks", async () => {
    const { container } = render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", {
        name: "Add Filter",
      })
    );
    expect(
      container.querySelector(`input[name="operator__and"]`)
    ).toBeChecked();
    expect(
      container.querySelector(`input[name="operator__or"]`)
    ).not.toBeChecked();

    await userEvent.click(
      screen.getAllByRole("option", {
        name: "OR",
      })[1]
    );

    await userEvent.type(
      screen.getAllByLabelText("Field")[2],
      "entity-1-number-field"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getAllByLabelText("Operator")[2], "Is Null");
    await userEvent.keyboard("{Enter}");

    expect(screen.getAllByLabelText("Value")).toHaveLength(2);

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Persistent Query",
      })
    );
  });

  it("should render current state correctly", async () => {
    const { container } = render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    expect(
      container.querySelector(`input[name="children[0].children[0].id"]`)
    ).toHaveValue("entity-1-string-field");

    expect(
      container.querySelector(
        `input[name="children[0].children[0].value.operator"]`
      )
    ).toHaveValue("e");

    expect(
      container.querySelector(
        `input[name="children[0].children[0].value.value"]`
      )
    ).toHaveValue("equal-value");

    expect(
      container.querySelector(`input[name="children[0].children[1].id"]`)
    ).toHaveValue("entity-1-date-field");

    expect(
      container.querySelector(
        `input[name="children[0].children[1].value.operator"]`
      )
    ).toHaveValue("l");

    expect(
      container.querySelector(
        `input[name="children[0].children[1].value.value"]`
      )
    ).toHaveValue("less-than-value");

    expect(
      container.querySelector(`input[name="children[0].operator__and"]`)
    ).not.toBeChecked();

    expect(
      container.querySelector(`input[name="children[0].operator__or"`)
    ).toBeChecked();

    expect(
      container.querySelector(`input[name="children[1].children[0].id"]`)
    ).toHaveValue("entity-1-number-field");

    expect(
      container.querySelector(
        `input[name="children[1].children[0].value.operator"]`
      )
    ).toHaveValue("s");

    expect(
      container.querySelector(
        `input[name="children[1].children[0].value.value"]`
      )
    ).toBeNull();

    expect(
      container.querySelector(`input[name="operator__and"]`)
    ).not.toBeChecked();
    expect(container.querySelector(`input[name="operator__or"]`)).toBeChecked();
  });

  it("should remove all filters", async () => {
    render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      screen.getAllByRole("button", {
        name: "Remove Nested Filter",
      })[0]
    );
    await userEvent.click(
      screen.getAllByRole("button", {
        name: "Remove Nested Filter",
      })[0]
    );
    await userEvent.click(
      screen.getAllByRole("button", {
        name: "Remove Nested Filter",
      })[0]
    );

    expect(screen.queryByLabelText("Field")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Value")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Operator")).not.toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save Persistent Query",
      })
    );
  });

  it("should not show any filters", async () => {
    render(
      <ApplicationRoot>
        <EntityPersistentQuerySettings />
      </ApplicationRoot>
    );

    expect(screen.queryByLabelText("Field")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Value")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Operator")).not.toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
});
