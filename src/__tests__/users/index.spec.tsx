import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ListUsers from "pages/users";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should list users", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      isReady: true,
    }));
    render(
      <ApplicationRoot>
        <ListUsers />
      </ApplicationRoot>
    );

    expect(
      await screen.findByRole("row", {
        name: "Username Sort By Username Filter Username By Search Name Sort By Name Filter Name By Search Role Sort By Role Filter Role By Status Action",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "user-1 User 1 Role 1 Edit User",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", {
        name: "user-2 User 2 Role 2 Edit User",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "user-3 User 3 Role 3 Edit User" })
    ).toBeInTheDocument();
  });

  it("should link to create user", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListUsers />
      </ApplicationRoot>
    );
    await userEvent.click(screen.getByRole("button", { name: "Add New User" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/users/create");
    });
  });

  it("should link to user edit", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListUsers />
      </ApplicationRoot>
    );

    const tableRows = await screen.findAllByRole("link", { name: "Edit User" });

    expect(tableRows[0]).toHaveAttribute("href", "/users/user-1");
    expect(tableRows[1]).toHaveAttribute("href", "/users/user-2");
    expect(tableRows[2]).toHaveAttribute("href", "/users/user-3");
  });

  it("should delete user", async () => {
    const pushMock = jest.fn();
    const replaceMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
      replace: replaceMock,
      isReady: true,
    }));

    render(
      <ApplicationRoot>
        <ListUsers />
      </ApplicationRoot>
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

    expect(await screen.findByRole("status")).toHaveTextContent(
      "User Deleted Successfully"
    );

    expect(replaceMock).toHaveBeenCalledWith("/users");
    expect(await screen.findAllByRole("row")).toHaveLength(3);
  });
});
