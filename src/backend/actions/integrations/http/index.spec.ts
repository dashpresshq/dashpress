import { HTTP_ACTION_INTEGRATION } from ".";

describe.skip("HTTP Action", () => {
  it("should call go GET correctly", () => {
    HTTP_ACTION_INTEGRATION.performsImplementation.GET.do(null, {
      url: "/foo",
      headers: { bar: "baz" },
    });
  });
});
