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
        apiKey: "some-api-key",
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
      "https://api.sendgrid.com/v3/mail/send",
      {
        body: '{"personalizations":[{"to":[{"email":"some-to"}]}],"from":{"email":"default-sender-email","name":"default-sender-name"},"subject":"some-subject","content":[{"type":"text/html","value":"<p>some-body</p>"}]}',
        headers: {
          Authorization: "Bearer some-api-key",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
  });

  it("should override the default sender when provided", async () => {
    await SEND_MAIL.do(
      {
        apiKey: "some-api-key",
        defaultSenderEmail: "default-sender-email",
        defaultSenderName: "default-sender-name",
      },
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        overrideSenderEmail: "override-sender-email",
        overrideSenderName: "override-sender-name",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://api.sendgrid.com/v3/mail/send",
      {
        body: '{"personalizations":[{"to":[{"email":"some-to"}]}],"from":{"email":"override-sender-email","name":"override-sender-name"},"subject":"some-subject","content":[{"type":"text/html","value":"<p>some-body</p>"}]}',
        headers: {
          Authorization: "Bearer some-api-key",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
  });
});
