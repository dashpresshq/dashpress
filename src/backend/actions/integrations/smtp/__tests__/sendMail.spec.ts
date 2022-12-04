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
          defaultSenderEmail: "default-sender-email",
          defaultSenderName: "default-sender-name",
        },
      ],
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
      }
    );

    expect(sendMailJestFn).toHaveBeenCalledWith({
      from: "default-sender-name <default-sender-email>",
      html: "<p>some-body</p>",
      subject: "some-subject",
      to: "some-to",
    });
  });

  it("should override the default sender when provided", async () => {
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
          defaultSenderEmail: "default-sender-email",
          defaultSenderName: "default-sender-name",
        },
      ],
      {
        to: "some-to",
        subject: "some-subject",
        body: "<p>some-body</p>",
        overrideSenderEmail: "override-sender-email",
        overrideSenderName: "override-sender-name",
      }
    );

    expect(sendMailJestFn).toHaveBeenCalledWith({
      from: "override-sender-name <override-sender-email>",
      html: "<p>some-body</p>",
      subject: "some-subject",
      to: "some-to",
    });
  });
});
