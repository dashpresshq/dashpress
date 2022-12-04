import { SMTP_ACTION_INTEGRATION } from "..";

const createTransportJestFn = jest.fn();

jest.mock("nodemailer", () => ({
  createTransport: (params) => createTransportJestFn(params),
}));

describe("SMTP_ACTION_INTEGRATION", () => {
  it("should connect correctly", async () => {
    createTransportJestFn.mockImplementation(() => "return-value");

    expect(
      await SMTP_ACTION_INTEGRATION.connect({
        host: "some-host",
        port: "some-port",
        authUser: "some-auth-user",
        authPassword: "some-auth-password",
      })
    ).toMatchInlineSnapshot(`
          [
            "return-value",
            {
              "authPassword": "some-auth-password",
              "authUser": "some-auth-user",
              "host": "some-host",
              "port": "some-port",
            },
          ]
        `);
  });

  it("should return 'false' for secure when port is not 465", async () => {
    await SMTP_ACTION_INTEGRATION.connect({
      host: "some-host",
      port: "some-port",
      authUser: "some-auth-user",
      authPassword: "some-auth-password",
    });

    expect(createTransportJestFn).toHaveBeenCalledWith({
      auth: { pass: "some-auth-password", user: "some-auth-user" },
      host: "some-host",
      port: "some-port",
      secure: false,
    });
  });

  it("should return 'true' for secure when port is 465", async () => {
    await SMTP_ACTION_INTEGRATION.connect({
      host: "some-host",
      port: 465,
      authUser: "some-auth-user",
      authPassword: "some-auth-password",
    });

    expect(createTransportJestFn).toHaveBeenCalledWith({
      auth: { pass: "some-auth-password", user: "some-auth-user" },
      host: "some-host",
      port: 465,
      secure: true,
    });
  });
});
