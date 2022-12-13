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
        apiKey: "some-apikey",
        defaultSenderEmail: "default-sender-email",
        defaultSenderName: "default-sender-name",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        body: '{"sender":{"name":"default-sender-name","email":"default-sender-email"},"to":[{"email":"some-to"}],"subject":"some-subject","htmlContent":"<p>some-body</p>"}',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": "api-key:some-apikey",
        },
        method: "POST",
      }
    );
  });

  it("should override the default sender when provided", async () => {
    await SEND_MAIL.do(
      {
        apiKey: "some-apikey",
        defaultSenderEmail: "default-sender-email",
        defaultSenderName: "default-sender-name",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        overrideSenderEmail: "override-sender-email",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        body: '{"sender":{"name":"default-sender-name","email":"override-sender-email"},"to":[{"email":"some-to"}],"subject":"some-subject","htmlContent":"<p>some-body</p>"}',
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
