import fetchMock from "jest-fetch-mock";

import { SEND_MAIL } from "../sendMail";

fetchMock.enableMocks();

describe("SEND_IN_BLUE => SEND_MAIL", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send mail API endpoint correctly", async () => {
    await SEND_MAIL.do(
      {
        apiKey: "some-apikey",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        senderEmail: "some-email",
        senderName: "some-name",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        body: '{"sender":{"name":"some-name","email":"some-email"},"to":[{"email":"some-to"}],"subject":"some-subject","htmlContent":"<p>some-body</p>"}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": "api-key:some-apikey",
        },
        method: "POST",
      }
    );
  });
});
