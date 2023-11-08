import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";

import RoleCreate from "pages/roles/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/roles/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should create new role", async () => {
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));
    render(
      <ApplicationRoot>
        <RoleCreate />
      </ApplicationRoot>
    );

    await userEvent.type(await screen.findByLabelText("Name"), "Some New Role");

    await userEvent.click(screen.getByRole("button", { name: "Create Role" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Role Created SuccessfullyClick here to view role"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Click here to view role" })
    );

    expect(pushMock).toHaveBeenCalledWith("/roles/some-new-role");
  });
});
