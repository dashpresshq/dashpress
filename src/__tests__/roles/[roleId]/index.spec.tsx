import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";

import RolePermissions from "pages/roles/[roleId]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

const closeAllToasts = async () => {
  const toast = screen.getByRole("button", {
    name: "Close Toast",
  });

  await userEvent.click(toast);

  await waitFor(
    () => {
      expect(toast).not.toBeInTheDocument();
    },
    { timeout: 20000 }
  );
};

describe("pages/roles/[roleId]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  useRouter.mockImplementation(() => ({
    asPath: "/",
    query: {
      roleId: "foo",
    },
    replace: jest.fn(),
    isReady: true,
  }));

  it("should select all user enabled admin permissions", async () => {
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
        name: "Can Manage All Entities",
      })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Dashboard",
      })
    ).toBeChecked();
  });

  it("should select all user enabled entities permissions", async () => {
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

  it("should update entity permissions", async () => {
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
          name: "Plural entity-3",
        })
      ).not.toBeChecked();
    });

    await userEvent.click(
      await within(currentTab).findByRole("button", {
        name: "Plural entity-2",
      })
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Plural entity-1" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Created Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", {
        name: "Plural disabled-entity-2",
      })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", {
        name: "Plural disabled-entity-2",
      })
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
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

  it("should toggle entities checkbox when 'Can Manage All Entities' is toggled", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel");

    expect(await within(currentTab).findAllByRole("checkbox")).toHaveLength(5);

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    await closeAllToasts();

    expect(within(currentTab).queryByRole("checkbox")).not.toBeInTheDocument();

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    expect(await within(currentTab).findAllByRole("checkbox")).toHaveLength(5);

    await closeAllToasts();
  });

  it("should update admin permissions", async () => {
    render(
      <ApplicationRoot>
        <RolePermissions />
      </ApplicationRoot>
    );

    const currentTab = await screen.findByRole("tabpanel");

    await userEvent.click(
      await within(currentTab).findByRole("button", {
        name: "Can Reset Password",
      })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Configure App" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Created Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Manage Users" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("button", { name: "Can Manage Users" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
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
        name: "Can Configure App",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("checkbox", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();
  });

  describe("Heirachy", () => {
    it("should toggle heirachy permissions on correctly", async () => {
      render(
        <ApplicationRoot>
          <RolePermissions />
        </ApplicationRoot>
      );

      await closeAllToasts();

      const currentTab = await screen.findByRole("tabpanel");

      // De-select the child permission
      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: "Can Manage All Entities",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Role Permission Deleted Successfully"
      );

      await closeAllToasts();

      expect(
        within(currentTab).queryByRole("checkbox", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();

      // Select the parent permission
      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Can Manage App Credentials",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Role Permission Created Successfully"
      );
    });

    it("should toggle heirachy permissions off correctly", async () => {
      render(
        <ApplicationRoot>
          <RolePermissions />
        </ApplicationRoot>
      );

      await closeAllToasts();

      const currentTab = await screen.findByRole("tabpanel");

      // See the children permissions are turned on correctly
      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Can Manage App Credentials",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Can Configure App",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Can Manage All Entities",
        })
      ).toBeChecked();

      // De-select the parent permission
      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: "Can Manage All Entities",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Role Permission Deleted Successfully"
      );
    });

    it("should show turned off children permissions correctly", async () => {
      render(
        <ApplicationRoot>
          <RolePermissions />
        </ApplicationRoot>
      );

      const currentTab = await screen.findByRole("tabpanel");

      // See the the child permissions are un-selected
      expect(
        within(currentTab).queryByRole("checkbox", {
          name: "Can Manage App Credentials",
        })
      ).not.toBeChecked();

      expect(
        within(currentTab).queryByRole("checkbox", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();

      expect(
        within(currentTab).queryByRole("checkbox", {
          name: "Can Manage All Entities",
        })
      ).not.toBeChecked();
    });
  });
});
