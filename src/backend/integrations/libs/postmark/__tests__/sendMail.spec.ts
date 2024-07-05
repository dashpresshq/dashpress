import fetchMock from "jest-fetch-mock";

import { SEND_MAIL } from "../sendMail";

fetchMock.enableMocks();

describe("POSTMARK => SEND_MAIL", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send mail API endpoint correctly", async () => {
    await SEND_MAIL.do(
      {
        serverToken: "some-server-token",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        senderEmail: "some-email",
      }
    );

    expect(fetch).toHaveBeenCalledWith("https://api.postmarkapp.com/email", {
      body: '{"From":"some-email","To":"some-to","subject":"some-subject","HtmlBody":"<p>some-body</p>","MessageStream":"outbound"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": "some-server-token",
      },
      method: "POST",
    });
  });
});
