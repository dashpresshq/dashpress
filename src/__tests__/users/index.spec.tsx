import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import ListUsers from "pages/users";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should list users", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
    render(
      <AppWrapper>
        <ListUsers />
      </AppWrapper>
    );

    expect(
      await screen.findByRole("row", { name: "Username Name Role Action" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "user-1 User 1 Role 1 Details" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "user-2 User 2 Role 2 Details" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: "user-3 User 3 Role 3 Details" })
    ).toBeInTheDocument();
  });

  it("should link to create user", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));

    render(
      <AppWrapper>
        <ListUsers />
      </AppWrapper>
    );
    await userEvent.click(screen.getByRole("button", { name: "Add New User" }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/users/create");
    });
  });

  it("should link to user details", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));

    render(
      <AppWrapper>
        <ListUsers />
      </AppWrapper>
    );

    const tableRows = await screen.findAllByRole("link", { name: "Details" });

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
    }));

    render(
      <AppWrapper>
        <ListUsers />
      </AppWrapper>
    );

    const tableRows = await screen.findAllByRole("row");

    expect(tableRows).toHaveLength(4);

    userEvent.click(
      within(tableRows[1]).getByRole("button", {
        name: "Delete Button",
      })
    );

    const confirmBox = await screen.findByRole("alertdialog", {
      name: "Confirm Delete",
    });

    userEvent.click(
      await within(confirmBox).findByRole("button", { name: "Confirm" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "User Deleted Successfully"
    );

    expect(replaceMock).toHaveBeenCalledWith("/users");
    expect(await screen.findAllByRole("row")).toHaveLength(3);
  });
});
