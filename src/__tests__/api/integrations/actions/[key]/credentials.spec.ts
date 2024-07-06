import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupCredentialsTestData,
} from "__tests__/api/_test-utils";
import handler from "pages/api/integrations/actions/[key]/credentials";
import { ActionIntegrations } from "shared/types/actions";

describe("/api/integrations/actions/[key]/credentials", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-integrations", "users"]);
    await setupCredentialsTestData({
      RANDOM___authUser:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      ACTION__SMTP___authUser:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      ACTION__SMTP___invalidField:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      ACTION__SMTP___host:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      ACTION__SMTP___port:
        "68ba76e500daa5d670930d24bbb425018571f18decc16d63ed901b85f6e99f74d3cf68225dcceb677b9a080cb1e8e8fd50abccbcf7d45fcf24c9578395b05b8aec57a763694e92fdbd2836bb91e66f17dc338bce18ae54cbb17098e1f1894c39870d7ff1cd",
    });
  });

  it("should not show action credentials when password is incorrect", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        key: ActionIntegrations.SMTP,
      },
      body: {
        _password: "invalid password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "Invalid Password",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should show action credentials only when password is correct", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        key: ActionIntegrations.SMTP,
      },
      body: {
        _password: "password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "authUser": "sqlite",
        "host": "sqlite",
        "port": "foo",
      }
    `);
  });

  it("should return empty for http", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        key: ActionIntegrations.HTTP,
      },
      body: {
        _password: "password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`{}`);
  });
});
