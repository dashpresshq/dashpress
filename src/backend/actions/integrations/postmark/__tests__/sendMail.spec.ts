import fetchMock from "jest-fetch-mock";
import { SEND_MAIL } from "../sendMail";

fetchMock.enableMocks();

describe("SEND_GRID => SEND_MAIL", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send mail API endpoint correctly", async () => {
    await SEND_MAIL.do(
      {
        serverToken: "some-server-token",
        defaultSenderEmail: "default-sender-email",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
      }
    );

    expect(fetch).toHaveBeenCalledWith("https://api.postmarkapp.com/email", {
      body: '{"From":"default-sender-email","To":"some-to","subject":"some-subject","HtmlBody":"<p>some-body</p>","MessageStream":"outbound"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": "some-server-token",
      },
      method: "POST",
    });
  });

  it("should override the default sender when provided", async () => {
    await SEND_MAIL.do(
      {
        serverToken: "some-server-token",
        defaultSenderEmail: "default-sender-email",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        overrideSenderEmail: "override-sender-email",
      }
    );

    expect(fetch).toHaveBeenCalledWith("https://api.postmarkapp.com/email", {
      body: '{"From":"override-sender-email","To":"some-to","subject":"some-subject","HtmlBody":"<p>some-body</p>","MessageStream":"outbound"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": "some-server-token",
      },
      method: "POST",
    });
  });
});
