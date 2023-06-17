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
      "https://api.sendgrid.com/v3/mail/send",
      {
        body: '{"personalizations":[{"to":[{"email":"some-to"}]}],"from":{"email":"some-email","name":"some-name"},"subject":"some-subject","content":[{"type":"text/html","value":"<p>some-body</p>"}]}',
        headers: {
          Authorization: "Bearer some-api-key",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
  });
});
