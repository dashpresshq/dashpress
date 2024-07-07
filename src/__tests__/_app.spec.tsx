import { render, screen } from "@testing-library/react";

import type { CustomNextPage } from "@/frontend/_layouts/types";
import MyApp from "@/pages/_app";

import { USE_ROUTER_PARAMS } from "./_/constants";

describe("pages/users", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  // eslint-disable-next-line react/function-component-definition
  const Foo: CustomNextPage = ({ title }: { title: string }) => {
    return <p>{title}</p>;
  };

  Foo.useAppLayout = false;

  it("should render components", async () => {
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

    render(
      <MyApp
        Component={Foo}
        pageProps={{ title: "Hello" }}
        router={jest.fn as any}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
