import handler from "pages/api/actions/integrations/index";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

describe("/api/actions/integrations/index", () => {
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
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "authUser": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "defaultSenderEmail": {
              "type": "text",
              "validations": [],
            },
            "defaultSenderName": {
              "type": "text",
              "validations": [],
            },
            "host": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "port": {
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
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "defaultSenderEmail": {
              "type": "text",
              "validations": [],
            },
            "defaultSenderName": {
              "type": "text",
              "validations": [],
            },
          },
          "description": "Send emails through SendGrid",
          "key": "sendgrid",
          "title": "SendGrid",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "defaultSenderEmail": {
              "type": "text",
              "validations": [],
            },
            "defaultSenderName": {
              "type": "text",
              "validations": [],
            },
            "domain": {
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
              "label": "Account SID",
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "authToken": {
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
            "defaultSenderEmail": {
              "type": "text",
              "validations": [],
            },
            "serverToken": {
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
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "defaultSenderEmail": {
              "type": "text",
              "validations": [],
            },
            "defaultSenderName": {
              "type": "text",
              "validations": [],
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
