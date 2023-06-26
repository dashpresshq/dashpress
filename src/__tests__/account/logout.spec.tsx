import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import AccountPassword from "pages/account/password";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/account/logout", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  const replaceMock = jest.fn();

  useRouter.mockImplementation(() => ({
    replace: replaceMock,
    asPath: "/",
  }));

  it("should log user out", async () => {
    render(
      <ApplicationRoot>
        <AccountPassword />
      </ApplicationRoot>
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Log Out" })
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/auth");
    });
    expect(localStorage.getItem("__auth-token__")).toBeNull();
  });
});
