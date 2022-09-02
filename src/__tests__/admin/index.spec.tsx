import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import Dashboard from "pages/admin";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/admin (Dashboard)", () => {
  it("render menu items correctly", async () => {
    localStorage.setItem("__auth-token__", "foo");

    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );
    const layoutContent = screen.getByTestId("app-layout__content");
    expect(
      await within(layoutContent).findByText("Plural entity-1")
    ).toBeInTheDocument();

    expect(
      await within(layoutContent).findByText("Plural entity-2")
    ).toBeInTheDocument();

    expect(
      await within(layoutContent).findByText("Plural entity-3")
    ).toBeInTheDocument();
  });
});

// userEvent.type(
//   screen.getByRole("textbox", { name: /username/i }),
//   "john.maverick"
// );
// userEvent.type(
//   screen.getByRole("textbox", { name: /password/i }),
//   "super-secret"
// );
// userEvent.click(screen.getByText(/submit/i));
// const alert = await screen.findByRole("alert");

// // Assert successful login state
// expect(alert).toHaveTextContent(/welcome/i);
// expect(window.sessionStorage.getItem("token")).toEqual(
//   fakeUserResponse.token
// );
// test("handles login exception", () => {
//   server.use(
//     rest.post("/login", (req, res, ctx) => {
//       // Respond with "500 Internal Server Error" status for this test.
//       return res(
//         ctx.status(500),
//         ctx.json({ message: "Internal Server Error" })
//       );
//     })
//   );

//   render(<Login />);
//   userEvent.type(
//     screen.getByRole("textbox", { name: /username/i }),
//     "john.maverick"
//   );
//   userEvent.type(
//     screen.getByRole("textbox", { name: /password/i }),
//     "super-secret"
//   );
//   userEvent.click(screen.getByText(/submit/i));

//   // Assert meaningful error message shown to the user
//   expect(alert).toHaveTextContent(/sorry, something went wrong/i);
//   expect(window.sessionStorage.getItem("token")).toBeNull();
// });
// //
