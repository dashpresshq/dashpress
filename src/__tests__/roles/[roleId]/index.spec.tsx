import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RolePermissions from "pages/roles/[roleId]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import {
  closeAllToasts,
  getToastMessage,
} from "__tests__/_/utils/closeAllToasts";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/roles/[roleId]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      query: {
        roleId: "foo",
      },
      replaceMock: jest.fn(),
    })
  );

  it("should select all user enabled admin permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    const currentTab = await screen.findByRole("tabpanel", { name: "App" });

    const allCheckBoxes = await within(currentTab).findAllByRole("switch");

    await waitFor(() => {
      expect(allCheckBoxes).toHaveLength(7);
    });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("switch", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("switch", { name: "Can Manage Users" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", { name: "Can Reset Password" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Can Manage All Entities",
      })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Can Manage Dashboard",
      })
    ).toBeChecked();
  });

  it("should select all user enabled entities permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );
    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel", { name: "Entities" });

    const allCheckBoxes = await within(currentTab).findAllByRole("switch");

    await waitFor(() => {
      expect(allCheckBoxes).toHaveLength(5);
    });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("switch", {
          name: "Plural entity-3",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("switch", { name: "Plural entity-1" })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("switch", { name: "Plural entity-2" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Plural disabled-entity-1",
      })
    ).not.toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Plural disabled-entity-2",
      })
    ).toBeChecked();
  });

  it("should update entity permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel", { name: "Entities" });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("switch", {
          name: "Plural entity-3",
        })
      ).not.toBeChecked();
    });

    await userEvent.click(
      await within(currentTab).findByRole("switch", {
        name: "Plural entity-2",
      })
    );
    expect(await getToastMessage()).toBe(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", { name: "Plural entity-1" })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Created Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", {
        name: "Plural disabled-entity-2",
      })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", {
        name: "Plural disabled-entity-2",
      })
    );
    expect(await getToastMessage()).toBe(
      "Role Permission Created Successfully"
    );
  });

  it("should show updated entity permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel", { name: "Entities" });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("switch", {
          name: "Plural entity-2",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("switch", { name: "Plural entity-1" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Plural disabled-entity-2",
      })
    ).toBeChecked();
  });

  it("should toggle entities checkbox when 'Can Manage All Entities' is toggled", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    await userEvent.click(await screen.findByRole("tab", { name: "Entities" }));

    const currentTab = screen.getByRole("tabpanel", { name: "Entities" });

    expect(await within(currentTab).findAllByRole("switch")).toHaveLength(5);

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    await closeAllToasts();

    expect(within(currentTab).queryByRole("switch")).not.toBeInTheDocument();

    await userEvent.click(
      within(currentTab).queryByRole("button", {
        name: "Can Manage All Entities",
      })
    );

    expect(await within(currentTab).findAllByRole("switch")).toHaveLength(5);

    await closeAllToasts();
  });

  it("should update admin permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    const currentTab = await screen.findByRole("tabpanel", { name: "App" });

    await userEvent.click(
      await within(currentTab).findByRole("switch", {
        name: "Can Reset Password",
      })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", { name: "Can Configure App" })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Created Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", { name: "Can Manage Users" })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Deleted Successfully"
    );

    await closeAllToasts();

    await userEvent.click(
      within(currentTab).getByRole("switch", { name: "Can Manage Users" })
    );

    expect(await getToastMessage()).toBe(
      "Role Permission Created Successfully"
    );
  });

  it("should show updated admin permissions", async () => {
    render(
      <TestProviders>
        <RolePermissions />
      </TestProviders>
    );

    const currentTab = screen.getByRole("tabpanel", { name: "App" });

    await waitFor(async () => {
      expect(
        await within(currentTab).findByRole("switch", {
          name: "Can Reset Password",
        })
      ).not.toBeChecked();
    });

    expect(
      within(currentTab).getByRole("switch", { name: "Can Manage Users" })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Can Configure App",
      })
    ).toBeChecked();

    expect(
      within(currentTab).getByRole("switch", {
        name: "Can Manage Permissions",
      })
    ).toBeChecked();
  });

  describe("Heirachy", () => {
    it("should toggle heirachy permissions on correctly", async () => {
      render(
        <TestProviders>
          <RolePermissions />
        </TestProviders>
      );

      await closeAllToasts();

      const currentTab = await screen.findByRole("tabpanel", { name: "App" });

      // De-select the child permission
      await userEvent.click(
        await within(currentTab).findByRole("switch", {
          name: "Can Manage All Entities",
        })
      );

      expect(await getToastMessage()).toBe(
        "Role Permission Deleted Successfully"
      );

      await closeAllToasts();

      expect(
        within(currentTab).queryByRole("switch", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();

      // Select the parent permission
      await userEvent.click(
        within(currentTab).getByRole("switch", {
          name: "Can Manage App Credentials",
        })
      );

      expect(await getToastMessage()).toBe(
        "Role Permission Created Successfully"
      );
    });

    it("should toggle heirachy permissions off correctly", async () => {
      render(
        <TestProviders>
          <RolePermissions />
        </TestProviders>
      );

      await closeAllToasts();

      const currentTab = await screen.findByRole("tabpanel", { name: "App" });

      // See the children permissions are turned on correctly
      expect(
        within(currentTab).getByRole("switch", {
          name: "Can Manage App Credentials",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Can Configure App",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Can Manage All Entities",
        })
      ).toBeChecked();

      // De-select the parent permission
      await userEvent.click(
        await within(currentTab).findByRole("switch", {
          name: "Can Manage All Entities",
        })
      );

      expect(await getToastMessage()).toBe(
        "Role Permission Deleted Successfully"
      );
    });

    it("should show turned off children permissions correctly", async () => {
      render(
        <TestProviders>
          <RolePermissions />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", { name: "App" });

      // See the the child permissions are un-selected
      expect(
        within(currentTab).queryByRole("switch", {
          name: "Can Manage App Credentials",
        })
      ).not.toBeChecked();

      expect(
        within(currentTab).queryByRole("switch", {
          name: "Can Configure App",
        })
      ).not.toBeChecked();

      expect(
        within(currentTab).queryByRole("switch", {
          name: "Can Manage All Entities",
        })
      ).not.toBeChecked();
    });
  });
});
