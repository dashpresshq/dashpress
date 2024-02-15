/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";

import UsersLinkToDatabase from "pages/users/database-link";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/users/database-link", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(() => ({
    asPath: "/",
    isReady: true,
  }));

  it("should save the link form correctly", async () => {
    render(
      <ApplicationRoot>
        <UsersLinkToDatabase />
      </ApplicationRoot>
    );

    await userEvent.type(
      await screen.findByLabelText("Your Users Table"),
      "entity-2"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Field Corresponding To Dashpress Usernames"),
      "entity-2-string-field"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Users Link To Database" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Users to Database Link Saved Successfully"
    );
  });

  it("should persist the link form correctly", async () => {
    const { container } = render(
      <ApplicationRoot>
        <UsersLinkToDatabase />
      </ApplicationRoot>
    );

    expect(
      container.querySelector(`input[name="children[0].children[0].id"]`)
    ).toHaveValue("entity-2");

    expect(container.querySelector(`input[name="field"]`)).toHaveValue(
      "entity-2-string-field"
    );
  });
});
