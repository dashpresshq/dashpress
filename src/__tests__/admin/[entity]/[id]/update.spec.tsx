import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import EntityUpdate from "pages/admin/[entity]/[id]/update";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/update", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should update data", async () => {
    render(
      <AppWrapper>
        <EntityUpdate />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Edit Singular entity-1")).toBeInTheDocument();
    });
  });
});
