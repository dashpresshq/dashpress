import { getBestErrorMessage } from "../utils";

describe("getBestErrorMessage", () => {
  it("should return the error if the error is a string", () => {
    expect(getBestErrorMessage("error")).toEqual("error");
  });

  it("should return the error message if there is a error message", () => {
    expect(getBestErrorMessage({ message: "custom message" })).toEqual(
      "custom message"
    );
  });

  it("should return the response error if there is a repsonse error", () => {
    expect(
      getBestErrorMessage({ response: { data: { message: "custom message" } } })
    ).toEqual("custom message");
  });

  it("should override 'Internal server error'", () => {
    expect(
      getBestErrorMessage({
        response: { data: { message: "Internal server error" } },
      })
    ).toEqual(
      "Oops! Something Went Wrong On Our End, Our Engineers Are Already Notified And Are Working On It. Please Check Back Shortly"
    );
  });

  it("should override 'Network Error'", () => {
    expect(
      getBestErrorMessage({ response: { data: { message: "Network Error" } } })
    ).toEqual("No Network Connection. Please Check Your Network And Try Again");
  });
});
