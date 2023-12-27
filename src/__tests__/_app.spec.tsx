import React from "react";
import { render, screen } from "@testing-library/react";

import MyApp from "pages/_app";

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  function Foo({ title }: { title: string }) {
    return <p>{title}</p>;
  }

  it("should render components", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      isReady: true,
    }));
    // eslint-disable-next-line react/jsx-no-bind
    render(<MyApp Component={Foo} pageProps={{ title: "Hello" }} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
