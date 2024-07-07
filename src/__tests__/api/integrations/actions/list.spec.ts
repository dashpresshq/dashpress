import handler from "@/pages/api/integrations/actions/list";
import { createAuthenticatedMocks } from "@/tests/api/setups";

describe("/api/integrations/actions/list", () => {
  it("should list integrations", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configurationSchema": {},
          "description": "Performs HTTP request",
          "key": "http",
          "title": "HTTP",
        },
        {
          "configurationSchema": {
            "authPassword": {
              "label": {
                "id": "8ZsakT",
                "message": "Password",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "authUser": {
              "label": {
                "id": "7PzzBU",
                "message": "User",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "host": {
              "label": {
                "id": "Ai2U7L",
                "message": "Host",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "port": {
              "label": {
                "id": "hZ6znB",
                "message": "Port",
              },
              "type": "number",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send emails through SMTP",
          "key": "smtp",
          "title": "SMTP",
        },
        {
          "configurationSchema": {
            "token": {
              "label": {
                "id": "TP9/K5",
                "message": "Token",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send messages to your Slack channels",
          "key": "slack",
          "title": "Slack",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "label": {
                "id": "yRnk5W",
                "message": "API Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send emails through SendGrid",
          "key": "sendgrid",
          "title": "SendGrid",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "label": {
                "id": "yRnk5W",
                "message": "API Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "domain": {
              "label": {
                "id": "EoKe5U",
                "message": "Domain",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send emails through Mailgun",
          "key": "mailgun",
          "title": "Mail Gun",
        },
        {
          "configurationSchema": {
            "accountSid": {
              "label": {
                "id": "Account SID",
                "message": "Account SID",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "authToken": {
              "label": {
                "id": "TP9/K5",
                "message": "Token",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send SMS through Twilio",
          "key": "twilio",
          "title": "Twilio",
        },
        {
          "configurationSchema": {
            "serverToken": {
              "label": {
                "id": "TP9/K5",
                "message": "Token",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send emails through Postmark",
          "key": "postmark",
          "title": "Postmark",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "label": {
                "id": "yRnk5W",
                "message": "API Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send emails through SendInBlue",
          "key": "sendInBlue",
          "title": "SendInBlue",
        },
      ]
    `);
  });
});
