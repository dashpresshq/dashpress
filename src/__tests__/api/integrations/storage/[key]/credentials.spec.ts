import handler from "pages/api/integrations/storage/[key]/credentials";
import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupCredentialsTestData,
} from "__tests__/api/_test-utils";

describe("/api/integrations/storage/[key]/credentials", () => {
  beforeAll(async () => {
    await setupAllTestData(["activated-storage", "users"]);
    await setupCredentialsTestData({
      RANDOM___accessKeyId:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      AWS_S3___accessKeyId:
        "3ff92bb3e142440f4d0a8aba3fab8ac4aabe573f889f1c4e77ec31e4ccdb2b146eb895c6f30c065d5669aca4edf7436d476c33677893caf0fa6ee8ff1a2a0792356f87a482a2d60f289dcca2cc3fc59f560c52a89a9e7787e43c6be8e1fcf4af1e6d5b33a27b9a0b1543581921a903c82b2f5c28'",
      AWS_S3___secretAccessKey:
        "91e0700d25fb2e3075362140a24308dc4fce6b5b76cfc042da543580391e9a98be61489f6bc91e7ecbb62afc55c888a793387a6f21976ac09ad4ad95fad29abcb2aeee58705297fa24433846d91219061baf873c1c7883064e864ac2c802a21560cc9b5750d049bd17edda5e389c21af6456c13b2735e1af",
      AWS_S3___region:
        "30a3d16f6bfdff93f54487936317a146c3f686f5defe8b8ed12bf9baf470764d7c5bf99f5162b4da3376484c26f7c159d56d52d15796ae7974a589c34c5afb94043f07e712acbeed080059b5c6c139eb3b54f43e844080cd0adbb97a0733ae64d55541ce278bf73c5bb835ab54",
      AWS_S3___shouldNotShowUp:
        "68ba76e500daa5d670930d24bbb425018571f18decc16d63ed901b85f6e99f74d3cf68225dcceb677b9a080cb1e8e8fd50abccbcf7d45fcf24c9578395b05b8aec57a763694e92fdbd2836bb91e66f17dc338bce18ae54cbb17098e1f1894c39870d7ff1cd",
    });
  });

  it("should not show storage credentials when password is incorrect", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        key: "http",
      },
      body: {
        password: "invalid password",
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

  it("should show storage credentials only when password is correct", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      query: {
        key: "s3",
      },
      body: {
        _password: "password",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "accessKeyId": "some-access-key-id",
        "region": "some-region",
        "secretAccessKey": "some-secret-access-key",
      }
    `);
  });
});
