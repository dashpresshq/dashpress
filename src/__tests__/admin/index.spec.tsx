import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import Dashboard from "pages";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { getTableRows } from "__tests__/_/utiis/getTableRows";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(() => ({
  query: {},
  asPath: "/",
  isReady: true,
}));

// it("should change relative time", async () => {
//   render(
//     <ApplicationRoot>
//       <Dashboard />
//     </ApplicationRoot>
//   );

//   await userEvent.click(
//     screen.getAllByRole("button", {
//       name: "Toggle Dropdown",
//     })[1]
//   );

//   await userEvent.click(
//     screen.getByRole("button", {
//       name: "Past 3 Months",
//     })
//   );

//   const widget = await screen.findByLabelText("New Summary Card Widget");

//   expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
//     "1.52K"
//   );
//   expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
//     "54%"
//   );
//   expect(
//     within(widget).getByLabelText("Relative Direction")
//     // :eyes #03d87f
//   ).toHaveAttribute("color", "#f5325c");
// });

describe("pages/admin", () => {
  it("should render table dashboard widget correctly", async () => {
    render(
      <ApplicationRoot>
        <Dashboard />
      </ApplicationRoot>
    );

    const widget = await screen.findByLabelText("Foo Table Widget");

    expect(await within(widget).findByText("Foo Table")).toBeInTheDocument();

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );

    expect(await getTableRows(widget)).toMatchInlineSnapshot(`
      [
        "NameAge",
        "John6",
        "Jane5",
      ]
    `);
  });

  it("should render summary card widget correctly", async () => {
    render(
      <ApplicationRoot>
        <Dashboard />
      </ApplicationRoot>
    );

    const widget = await screen.findByLabelText("Bar Card Widget");

    expect(await within(widget).findByText("Bar Card")).toBeInTheDocument();
    expect(within(widget).getByLabelText("Bar Card Icon")).toHaveTextContent(
      "Some SVG Here"
    );

    //   expect(within(widget).getByLabelText("New Summary Card Icon").innerHTML)
    // .toBe(`<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    //               <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" d="M10 21a1 1 0 11-2 0 1 1 0 012 0zM21 21a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39c.188.925.995 1.61 1.962 1.61h.04-.002H19.438a2 2 0 001.959-1.597l.002-.013 1.6-8.39h-17"></path>
    //             </svg>`);

    expect(within(widget).getByLabelText("Bar Card Icon")).toHaveAttribute(
      "color",
      "#FF165D"
    );
    expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
      "10"
    );

    expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
      "100%"
    );

    expect(within(widget).getByLabelText("Relative Direction")).toHaveAttribute(
      "color",
      "#03d87f"
    );

    expect(within(widget).getByLabelText("Bar Card Icon")).toHaveAttribute(
      "color",
      "#FF165D"
    );

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );
  });

  it("should render correct buttons for table widget", async () => {
    render(
      <ApplicationRoot>
        <Dashboard />
      </ApplicationRoot>
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
      <ApplicationRoot>
        <Dashboard />
      </ApplicationRoot>
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
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
        query: {},
        asPath: "/",
        isReady: true,
      }));

      render(
        <ApplicationRoot>
          <Dashboard />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Edit Dashboard" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/dashboard/manage");
    });
  });
});
