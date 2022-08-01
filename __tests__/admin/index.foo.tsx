import "@testing-library/jest-dom";
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "@testing-library/react";
import Dashboard from "pages";

const server = setupServer(
  rest.get("/api/entities/menu", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          value: "entity-1",
          label: "Entity 1",
        },
        {
          value: "entity-2",
          label: "Entity 2",
        },
        {
          value: "entity-3",
          label: "Entity 3",
        },
      ])
    );
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test("allows the user to log in", async () => {
  render(<Dashboard />);
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
});

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
