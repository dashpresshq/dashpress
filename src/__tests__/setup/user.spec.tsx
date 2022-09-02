import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
// import { rest, server } from "__tests__/server";
// import singletonRouter from "next/router";
import mockRouter from "next-router-mock";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import DBCredentials from "../../pages/setup/credentials";

jest.mock("next/router", () => require("next-router-mock"));

setupApiHandlers();

describe("<DBCredentials />", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/initial");
  });

  it("should render form", async () => {
    render(
      <AppWrapper>
        <DBCredentials />
      </AppWrapper>
    );

    // expect(singletonRouter.pathname).toBe("/initial");

    expect(await screen.findByText("Setup DB credentials")).toBeInTheDocument();

    // expect(singletonRouter.pathname).toBe("/initial");

    // expect(await screen.findByText("Admin Account Setup")).toBeInTheDocument();
  });
});

// describe("<DBCredentials /> 2", () => {
//   //   beforeEach(() => {
//   //     server.use(
//   //       rest.get(
//   //         "http://localhost:3000/api/setup/check",
//   //         async (req, res, ctx) => {
//   //           console.log("Using Me");
//   //           return res(
//   //             ctx.json({
//   //               hasUsers: false,
//   //               hasDbCredentials: false,
//   //             })
//   //           );
//   //         }
//   //       )
//   //     );
//   //   });
//   it("should redirect to users page when DB credentials is set", async () => {
//     render(
//       <AppWrapper>
//         <DBCredentials />
//       </AppWrapper>
//     );

//     expect(await screen.findByText("Admin Account Setup")).toBeInTheDocument();
//   });
