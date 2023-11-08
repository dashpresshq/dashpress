/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render } from "@testing-library/react";

import { GoogleTagManager } from ".";

describe("GoogleTagManager", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should not render script when there is google tag", async () => {
    const { container } = render(<GoogleTagManager />);
    expect(container.firstChild).toBeNull();
  });

  it("should render script when there is NEXT_PUBLIC_GOOGLE_TAG_ID in env", async () => {
    process.env.NEXT_PUBLIC_GOOGLE_TAG_ID = "some-script";

    const { container } = render(<GoogleTagManager />);

    expect(container.firstChild).not.toBeNull();
  });
});
