import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OffCanvas } from ".";

function Template() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open Canvas
      </button>
      <OffCanvas
        title="Some Awesome Canvas Title"
        show={open}
        onClose={() => setOpen(false)}
      >
        <p>Some awesome content</p>
      </OffCanvas>
    </>
  );
}

describe.skip("OffCanvas", () => {
  it("should open and close modal", async () => {
    render(<Template />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Some awesome content")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Open Canvas" }));

    expect(
      screen.getByRole("dialog", { name: "Some Awesome Canvas Title" })
    ).toBeInTheDocument();

    expect(screen.getByText("Some awesome content")).toBeInTheDocument();
  });
});
