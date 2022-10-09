import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
// import userEvent from "@testing-library/user-event";
import EntityRelationsSettings from "pages/admin/[entity]/config/relations";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/config/relations", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });
  describe("Reference Template", () => {
    it("should display reference template", async () => {
      render(
        <AppWrapper>
          <EntityRelationsSettings />
        </AppWrapper>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Display Format")).toHaveValue(
          "entity-1 - {{ name }}"
        );
      });
    });

    //   it("should update reference template", async () => {
    //     render(
    //       <AppWrapper>
    //         <EntityRelationsSettings />
    //       </AppWrapper>
    //     );

    //     await userEvent.type(screen.getByLabelText("Plural"), "Updated");
    //     await userEvent.type(screen.getByLabelText("Singular"), "Updated");

    //     await userEvent.click(
    //       screen.getByRole("button", { name: "Update Diction" })
    //     );

    //     expect(await screen.findByRole("status")).toHaveTextContent(
    //       "App Settings Saved Successfully"
    //     );
    //   });

    //   it("should display updated diction values", async () => {
    //     render(
    //       <AppWrapper>
    //         <EntityDictionSettings />
    //       </AppWrapper>
    //     );
    //     await waitFor(() => {
    //       expect(screen.getByLabelText("Plural")).toHaveValue(
    //         "Plural entity-1Updated"
    //       );
    //     });
    //     expect(screen.getByLabelText("Singular")).toHaveValue(
    //       "Singular entity-1Updated"
    //     );
    //   });
  });
});
