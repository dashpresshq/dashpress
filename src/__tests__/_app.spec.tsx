import { render, screen } from "@testing-library/react";

import MyApp from "pages/_app";
import { USE_ROUTER_PARAMS } from "./_/constants";

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  function Foo({ title }: { title: string }) {
    return <p>{title}</p>;
  }

  it("should render components", async () => {
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

    render(
      <MyApp
        // eslint-disable-next-line react/jsx-no-bind
        Component={Foo}
        pageProps={{ title: "Hello" }}
        router={jest.fn as any}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
