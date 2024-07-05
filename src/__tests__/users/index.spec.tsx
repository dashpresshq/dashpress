import { render, screen, within, waitFor } from "@testing-library/react";

import ListUsers from "pages/users";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { getTableRows } from "__tests__/_/utils/getTableRows";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { getToastMessage } from "../_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should list users", async () => {
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
    render(
      <TestProviders>
        <ListUsers />
      </TestProviders>
    );

    expect(await getTableRows(await screen.findByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Username|Name|Role|Action",
        "user-1|User 1|Role 1",
        "user-2|User 2|Role 2",
        "user-3|User 3|Role 3",
      ]
    `);
  });

  it("should link to create user", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

    render(
      <TestProviders>
        <ListUsers />
      </TestProviders>
    );
    await userEvent.click(screen.getByRole("button", { name: "Add New User" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/users/create");
    });
  });

  it("should link to user edit", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

    render(
      <TestProviders>
        <ListUsers />
      </TestProviders>
    );

    const tableRows = await screen.findAllByRole("link", { name: "Edit User" });

    expect(tableRows[0]).toHaveAttribute("href", "/users/user-1");
    expect(tableRows[1]).toHaveAttribute("href", "/users/user-2");
    expect(tableRows[2]).toHaveAttribute("href", "/users/user-3");
  });

  it("should delete user", async () => {
    const replaceMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ replaceMock }));

    render(
      <TestProviders>
        <ListUsers />
      </TestProviders>
    );

    const tableRows = await screen.findAllByRole("row");

    expect(tableRows).toHaveLength(4);

    await userEvent.click(
      within(tableRows[1]).getByRole("button", {
        name: "Delete User",
      })
    );

    const confirmBox = await screen.findByRole("alertdialog", {
      name: "Confirm Delete",
    });

    await userEvent.click(
      await within(confirmBox).findByRole("button", { name: "Confirm" })
    );

    expect(await getToastMessage()).toBe("User Deleted Successfully");

    expect(replaceMock).toHaveBeenCalledWith("/users");
    expect(await screen.findAllByRole("row")).toHaveLength(3);
  });
});
