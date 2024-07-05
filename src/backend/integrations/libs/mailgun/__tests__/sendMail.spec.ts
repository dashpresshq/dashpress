import fetchMock from "jest-fetch-mock";

import { SEND_MAIL } from "../sendMail";

fetchMock.enableMocks();

describe("MAIL_GUN => SEND_MAIL", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send mail API endpoint correctly", async () => {
    await SEND_MAIL.do(
      {
        apiKey: "some-api-key",
        domain: "some-domain",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        senderEmail: "sender-email",
      }
    );

    expect(fetch).toHaveBeenCalled();
  });
});
