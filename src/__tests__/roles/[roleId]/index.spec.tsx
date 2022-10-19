/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import RolePermissions from "pages/roles/[roleId]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/roles/[roleId]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  useRouter.mockImplementation(() => ({
    asPath: "/",
    query: {
      roleId: "foo",
    },
  }));
  it("should select role permissions", async () => {
    render(
      <AppWrapper>
        <RolePermissions />
      </AppWrapper>
    );

    const allCheckBoxes = await screen.findAllByRole("checkbox");

    await waitFor(() => {
      expect(allCheckBoxes).toHaveLength(12);
    });

    await waitFor(async () => {
      expect(
        await screen.findByRole("checkbox", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Can Manage User" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Reset Password" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", {
        name: "Can Manage Dashboard",
      })
    ).not.toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Manage Permissions" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Access Entity All Entities" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Access Entity Entity 1" })
    ).not.toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Access Entity Entity 2" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Access Entity Entity 3" })
    ).not.toBeChecked();

    expect(
      screen.getByRole("checkbox", {
        name: "Can Access Entity Disabled Entity 1",
      })
    ).not.toBeChecked();

    expect(
      screen.getByRole("checkbox", {
        name: "Can Access Entity Disabled Entity 2",
      })
    ).toBeChecked();
  });

  it("should update permissions", async () => {
    render(
      <AppWrapper>
        <RolePermissions />
      </AppWrapper>
    );
    await userEvent.click(
      await screen.findByRole("checkbox", { name: "Can Reset Password" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Can Manage Dashboard" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Can Manage User" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Can Manage User" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );
  });

  it("should show updated permissions", async () => {
    render(
      <AppWrapper>
        <RolePermissions />
      </AppWrapper>
    );

    await waitFor(async () => {
      expect(
        await screen.findByRole("checkbox", {
          name: "Can Reset Password",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Can Manage User" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", {
        name: "Can Manage Dashboard",
      })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Can Manage Permissions" })
    ).toBeChecked();
  });
});
