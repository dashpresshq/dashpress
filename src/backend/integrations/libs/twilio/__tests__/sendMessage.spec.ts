import fetchMock from "jest-fetch-mock";

import { SEND_SMS } from "../sendSms";

fetchMock.enableMocks();

describe("TWILIO => SEND_SMS", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send message API endpoint correctly", async () => {
    await SEND_SMS.do(
      {
        authToken: "some-auth-token",
        accountSid: "some-account-SID",
      },
      {
        from: "some from",
        to: "some to",
        body: "some body",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.twilio.com/2010-04-01/Accounts/some-account-SID/Messages.json",
      {
        body: "Body=some+body&From=some+from&To=some+to",
        headers: {
          Authorization: "Basic c29tZS1hY2NvdW50LVNJRDpzb21lLWF1dGgtdG9rZW4=",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }
    );
  });
});
