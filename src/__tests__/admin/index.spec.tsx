import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Dashboard from "@/pages";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getTableRows } from "@/tests/utils";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("pages/admin", () => {
  useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

  it("should render table dashboard widget correctly", async () => {
    render(
      <TestProviders>
        <Dashboard />
      </TestProviders>
    );

    const widget = await screen.findByLabelText("Foo Table Widget");

    expect(await within(widget).findByText("Foo Table")).toBeInTheDocument();

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );

    expect(await getTableRows(widget)).toMatchInlineSnapshot(`
      [
        "Name|Age",
        "John|6",
        "Jane|5",
      ]
    `);
  });

  it("should render summary card widget correctly", async () => {
    render(
      <TestProviders>
        <Dashboard />
      </TestProviders>
    );

    const widget = await screen.findByLabelText("Bar Card Widget");

    expect(await within(widget).findByText("Bar Card")).toBeInTheDocument();
    expect(within(widget).getByLabelText("Bar Card Icon")).toHaveTextContent(
      "Some SVG Here"
    );

    expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
      "10"
    );

    expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
      "100%"
    );

    expect(within(widget).getByLabelText("Relative Direction")).toHaveClass(
      "bg-green-100"
    );

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );
  });

  it("should render correct buttons for table widget", async () => {
    render(
      <TestProviders>
        <Dashboard />
      </TestProviders>
    );

    const widget = await screen.findByLabelText("Foo Table Widget");

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );
    expect(
      within(widget).queryByRole("button", { name: "Delete Button" })
    ).not.toBeInTheDocument();
    expect(
      within(widget).queryByRole("button", { name: "Edit Widget" })
    ).not.toBeInTheDocument();
  });

  it("should render correct buttons for summary card widget", async () => {
    render(
      <TestProviders>
        <Dashboard />
      </TestProviders>
    );

    const widget = await screen.findByLabelText("Bar Card Widget");

    expect(
      within(widget).queryByRole("button", { name: "Delete Button" })
    ).not.toBeInTheDocument();
    expect(
      within(widget).queryByRole("button", { name: "Edit Widget" })
    ).not.toBeInTheDocument();
  });

  describe("Action Button", () => {
    it("should go to settings page on 'Edit Dashboard'", async () => {
      const replaceMock = jest.fn();

      useRouter.mockImplementation(USE_ROUTER_PARAMS({ replaceMock }));

      render(
        <TestProviders>
          <Dashboard />
        </TestProviders>
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Edit Dashboard" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/dashboard/manage");
    });
  });
});
