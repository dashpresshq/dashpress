import { render, screen, within } from "@testing-library/react";
import TableViewsSettings from "pages/admin/[entity]/config/views";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/admin/[entity]/config/views", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
        },
      })
    );
  });

  it("should display Table Views", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(
      await screen.findByRole("tab", { name: "Verified Entity View" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "User Entity View" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Age Entity View" })
    ).toBeInTheDocument();
  });

  it("should tab through views", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(
      await screen.findByRole("tab", { name: "Verified Entity View" })
    ).toBeInTheDocument();

    expect(
      within(
        screen.getByRole("tabpanel", { name: "Verified Entity View" })
      ).getByLabelText("Title")
    ).toHaveValue("Verified Entity View");

    await userEvent.click(
      screen.getByRole("tab", { name: "User Entity View" })
    );

    expect(
      await within(
        screen.getByRole("tabpanel", { name: "User Entity View" })
      ).findByLabelText("Title")
    ).toHaveValue("User Entity View");

    await userEvent.click(screen.getByRole("tab", { name: "Age Entity View" }));

    expect(
      await within(
        screen.getByRole("tabpanel", { name: "Age Entity View" })
      ).findByLabelText("Title")
    ).toHaveValue("Age Entity View");
  });

  it("should delete table view", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(
      await screen.findByRole("tab", { name: "Verified Entity View" })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Age Entity View" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Table View" })
    );

    expect(
      screen.queryByRole("tab", { name: "Age Entity View" })
    ).not.toBeInTheDocument();

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "User Entity View"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Table View" })
    );

    expect(
      screen.queryByRole("tab", { name: "User Entity View" })
    ).not.toBeInTheDocument();

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Verified Entity View"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Table View" })
    );

    expect(
      screen.queryByRole("button", { name: "Delete Table View" })
    ).not.toBeInTheDocument();

    expect(screen.queryAllByRole("tab")).toHaveLength(0);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Save Table Views" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Table Views Saved Successfully"
    );
  });

  it("should display delete changes", () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });

  it("should add new table view", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add New Table View" })
    );

    expect(
      await within(
        screen.getByRole("tabpanel", { name: "View 1" })
      ).findByLabelText("Title")
    ).toHaveValue("View 1");

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "View 1"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add New Table View" })
    );

    expect(
      await within(
        screen.getByRole("tabpanel", { name: "View 2" })
      ).findByLabelText("Title")
    ).toHaveValue("View 2");

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "View 2"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save Table Views" })
    );

    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Table Views Saved Successfully"
    );
  });

  it("should edit existing tabs", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(
      await screen.findByRole("tab", { name: "View 1" })
    ).toBeInTheDocument();

    await userEvent.type(
      within(screen.getByRole("tabpanel", { name: "View 1" })).getByLabelText(
        "Title"
      ),
      "Updated"
    );

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "View 1Updated"
    );

    expect(screen.getByRole("tab", { name: "View 2" })).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Save Table Views" })
    );

    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Table Views Saved Successfully"
    );
  });

  it("should save edit changes", async () => {
    render(
      <TestProviders>
        <TableViewsSettings />
      </TestProviders>
    );
    expect(
      await screen.findByRole("tab", { name: "View 1Updated" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "View 2" })).toBeInTheDocument();

    await userEvent.type(
      within(
        screen.getByRole("tabpanel", { name: "View 1Updated" })
      ).getByLabelText("Title"),
      "Updated"
    );
  });
});

// add to these test when the sort and filters are accessible
