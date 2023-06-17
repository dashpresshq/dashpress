import { SEND_MAIL } from "../sendMail";

const sendMailJestFn = jest.fn();

describe("SMTP => SEND_MAIL", () => {
  it("should call the send mail API endpoint correctly", async () => {
    await SEND_MAIL.do(
      [
        {
          sendMail: sendMailJestFn,
        },
        {
          host: "some-host",
          port: 451,
          authUser: "some-auth-user",
          authPassword: "some-auth-password",
        },
      ],
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        senderEmail: "some-email",
        senderName: "some-name",
      }
    );

    expect(sendMailJestFn).toHaveBeenCalledWith({
      from: "some-name <some-email>",
      html: "<p>some-body</p>",
      subject: "some-subject",
      to: "some-to",
    });
  });
});
