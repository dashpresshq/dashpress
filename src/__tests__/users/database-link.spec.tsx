/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UsersLinkToDatabase from "pages/users/database-link";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { getToastMessage } from "../_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/users/database-link", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

  it("should save the link form correctly", async () => {
    render(
      <TestProviders>
        <UsersLinkToDatabase />
      </TestProviders>
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

    expect(await getToastMessage()).toBe(
      "Users to Database Link Saved Successfully"
    );
  });

  it("should persist the link form correctly", async () => {
    const { container } = render(
      <TestProviders>
        <UsersLinkToDatabase />
      </TestProviders>
    );

    expect(container.querySelector(`input[name="table"]`)).toHaveValue(
      "entity-2"
    );

    expect(container.querySelector(`input[name="field"]`)).toHaveValue(
      "entity-2-string-field"
    );
  });
});
