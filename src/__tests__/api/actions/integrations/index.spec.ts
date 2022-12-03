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
            "token": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send Message to the ones you love",
          "key": "slack",
          "title": "Slack",
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
          "description": "Send Message to the ones you love",
          "key": "twilio",
          "title": "Twilio",
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
            "defaultSenderAddress": {
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
            "secure": {
              "type": "boolean",
              "validations": [],
            },
          },
          "description": "Send Message to the ones you love",
          "key": "smtp",
          "title": "SMTP",
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
          },
          "description": "Send Message to the ones you love",
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
            "domain": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "description": "Send Message to the ones you love",
          "key": "mailgun",
          "title": "Mail Gun",
        },
      ]
    `);
  });
});
