import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
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
  it("should select all admin permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    const currentTab = await screen.findByRole("tabpanel");

    const allCheckBoxes = await within(currentTab).findAllByRole("checkbox");

    await waitFor(() => {
      expect(allCheckBoxes).toHaveLength(7);
    });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("checkbox", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("checkbox", { name: "Can Manage Users" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", { name: "Can Reset Password" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Dashboard",
      })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage All Entities",
      })
    ).toBeChecked();
  });

  it("should show entities checkbox only when 'Can Manage All Entities' is checked", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel");

    expect(within(currentTab).queryByRole("checkbox")).not.toBeInTheDocument();

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    expect(await within(currentTab).findAllByRole("checkbox")).toHaveLength(5);

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    expect(within(currentTab).queryByRole("checkbox")).not.toBeInTheDocument();

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );
  });

  it("should select all entities permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );
    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel");

    const allCheckBoxes = await within(currentTab).findAllByRole("checkbox");

    await waitFor(() => {
      expect(allCheckBoxes).toHaveLength(5);
    });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("checkbox", {
          name: "Plural entity-3",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("checkbox", { name: "Plural entity-1" })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", { name: "Plural entity-2" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Plural disabled-entity-1",
      })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Plural disabled-entity-2",
      })
    ).toBeChecked();
  });

  it("should update admin permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    const currentTab = screen.getByRole("tabpanel");

    await userEvent.click(
      await within(currentTab).findByRole("button", {
        name: "Can Reset Password",
      })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Manage Dashboard" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Manage Users" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );
    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Manage Users" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );
  });

  it("should show updated admin permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    const currentTab = screen.getByRole("tabpanel");

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("checkbox", {
          name: "Can Reset Password",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("checkbox", { name: "Can Manage Users" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Dashboard",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();
  });

  it("should update entity permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel");

    await userEvent.click(
      await within(currentTab).findByRole("button", {
        name: "Plural entity-2",
      })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Plural entity-1" })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );

    await userEvent.click(
      within(currentTab).getByRole("button", {
        name: "Plural disabled-entity-2",
      })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );
    await userEvent.click(
      within(currentTab).getByRole("button", {
        name: "Plural disabled-entity-2",
      })
    );
    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Role Permission Created Successfully"
    );
  });

  it("should show updated entity permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel");

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("checkbox", {
          name: "Plural entity-2",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("checkbox", { name: "Plural entity-1" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Plural disabled-entity-2",
      })
    ).toBeChecked();
  });

  // todo test heirachy
});
