import fetchMock from "jest-fetch-mock";
import indexHandler from "pages/api/data/[entity]/index";
import detailsHandler from "pages/api/data/[entity]/[id]/index";

import {
  createAuthenticatedMocks,
  setupAllTestData,
  setupCredentialsTestData,
} from "__tests__/api/_test-utils";
import { setupActionInstanceTestData } from "__tests__/api/_test-utils/_action-instances";
import { setupIntegrationsConstantsTestData } from "__tests__/api/_test-utils/_integrations-constants";
import { createTransport } from "nodemailer";
import { HTTP_ACTIVATION_ID } from "shared/types/actions";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(),
}));

fetchMock.enableMocks();

const sendMail = jest.fn();

describe("Run Action", () => {
  beforeAll(async () => {
    await setupAllTestData([
      "activated_actions",
      "schema",
      "app-config",
      "data",
    ]);

    await setupIntegrationsConstantsTestData({
      SITE_EMAIL: "hello@hadmean.com",
      SITE_NAME: "John Snow",
    });

    await setupCredentialsTestData({
      CREDENTIAL_KEY_1:
        "130bb23ce9c3aab260129c0504436b88d5c6061ca234fa61b6d6a6280345b9cb99e39dad4566b484a07e18f05ad7ad742020cc9fae0d84d87be54cc776145a949a5669cea8a5a403d3493edf4b7c33b72e1c5458d8168e93fdf99b35ade3ddbbd3134ba9489d5330fad32eb845347e97522bf1df",
      CREDENTIAL_KEY_2:
        "6e5ce77ce5029294f197cbf18f16351a515b51cdad8571c6ff0d09d699f5a07a780e1afeac1e0f9c3a342aa516ac6692ff223cacd82312a094ddd940d37dd4fe1a06c9dde7d3d13aab9da595ec1047937db08b656a1821d68b36b8f7618b1e6336173b15a4eff47a3c31165cde11a410f07f0350",

      DATABASE___dataSourceType:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",

      DATABASE___connectionString:
        "cfe84f1c0ce195021dbe740b0088064276df13dd0d2a8dda4f007f78989d17a26562910709adc261c05f20f855d26a89284effcdb6932ed618b0d8b6fb98fc6b0e9ebab8d53aa1570ec0e40e89db851e6987eed665f12dece0f31b7a4ffe3dcd1ee3f4ba0096b68a578d0d582507ae2cd62dfb255074",

      SMTP___authPassword:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      SMTP___authUser:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      SMTP___host:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
      SMTP___port:
        "68ba76e500daa5d670930d24bbb425018571f18decc16d63ed901b85f6e99f74d3cf68225dcceb677b9a080cb1e8e8fd50abccbcf7d45fcf24c9578395b05b8aec57a763694e92fdbd2836bb91e66f17dc338bce18ae54cbb17098e1f1894c39870d7ff1cd",

      SLACK___token:
        "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",
    });

    await setupActionInstanceTestData([
      {
        instanceId: "instance-id-1",
        activatedActionId: "smtp-activation-id-1",
        integrationKey: "smtp",
        entity: "tests",
        implementationKey: "SEND_MAIL",
        triggerLogic: "",
        formAction: "create",
        configuration: {
          to: "{{ data.id }}@hadmean.com",
          subject: "CREATE TEST",
          body: "{{data.name}} has the age of {{ data.age }}",
          overrideSenderName:
            "Constants are correctly compiled {{ CONSTANT.SITE_NAME }}",
          overrideSenderEmail:
            "Secrets are correctly compiled {{ SECRET.CREDENTIAL_KEY_1 }}",
        },
      },
      {
        instanceId: "instance-id-5",
        activatedActionId: HTTP_ACTIVATION_ID,
        integrationKey: "http",
        entity: "tests",
        implementationKey: "POST",
        triggerLogic: "",
        formAction: "create",
        configuration: {
          url: "http://CREATE.TEST",
          headers: `{
            "some_credential": "{{ SECRET.CREDENTIAL_KEY_1 }}",
            "some_constant": "{{ CONSTANT.SITE_NAME }}"
          }`,
          body: `{"data": "{{data.name}} has the age of {{ data.age }}"}`,
        },
      },
      {
        instanceId: "instance-id-2",
        activatedActionId: "slack-activation-id-2",
        integrationKey: "slack",
        entity: "tests",
        implementationKey: "SEND_MESSAGE",
        triggerLogic: "",
        formAction: "update",
        configuration: {
          channel: "UPDATE TEST",
          message:
            "{{data.name}} has the age of {{ data.age }} \n Secrets are correctly compiled {{ SECRET.CREDENTIAL_KEY_1 }} \n Constants are correctly compiled {{ CONSTANT.SITE_NAME }}",
        },
      },
      {
        instanceId: "instance-id-3",
        activatedActionId: "slack-activation-id-2",
        integrationKey: "slack",
        entity: "DO_NOT_CALL_ME_CAUSE_INVALID_ENTITY",
        implementationKey: "SEND_MESSAGE",
        triggerLogic: "",
        formAction: "update",
        configuration: {
          channel: "UPDATE TEST",
          message:
            "{{data.name}} has the age of {{ data.age }} \n Secrets are correctly compiled {{ SECRET.CREDENTIAL_KEY_1 }} \n Constants are correctly compiled {{ CONSTANT.SITE_NAME }}",
        },
      },
      {
        instanceId: "instance-id-4",
        activatedActionId: HTTP_ACTIVATION_ID,
        integrationKey: "http",
        entity: "tests",
        implementationKey: "POST",
        triggerLogic: "",
        formAction: "delete",
        configuration: {
          url: "http://DELETE.TEST",
          headers: `{
            "some_credential": "{{ SECRET.CREDENTIAL_KEY_1 }}",
            "some_constant": "{{ CONSTANT.SITE_NAME }}",
            "none-existent_constant": "{{ CONSTANT.NO_EXISTENT }}",
            "empty-because-is-group-credential": "{{ SECRET.DATABASE___connectionString }}"
          }`,
          body: `{"data": "{{data.name}} has the age of {{ data.age }}"}`,
        },
      },
    ]);
  });

  describe("CREATE", () => {
    it("trigger all actions on create with correct compiled values", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          entity: "tests",
        },
        body: {
          data: {
            age: 100,
            createdAt: new Date("2022-08-17T11:29:57.330Z"),
            id: 44,
            name: "Newly Created",
            status: "closed",
            verified: true,
            referenceId: 9,
          },
        },
      });

      (createTransport as jest.Mock).mockImplementation(() => {
        return { sendMail };
      });

      await indexHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "id": 44,
        }
      `);

      expect(createTransport as jest.Mock).toHaveBeenCalledWith({
        auth: { pass: "sqlite", user: "sqlite" },
        host: "sqlite",
        port: "foo",
        secure: false,
      });

      expect(sendMail).toHaveBeenCalledWith({
        from: "Constants are correctly compiled John Snow <Secrets are correctly compiled CREDENTIAL_VALUE_1>",
        html: "Newly Created has the age of 100",
        subject: "CREATE TEST",
        to: "44@hadmean.com",
      });

      expect(fetch).toHaveBeenCalledWith("http://CREATE.TEST", {
        body: '{"data": "Newly Created has the age of 100"}',
        headers: {
          some_constant: "John Snow",
          some_credential: "CREDENTIAL_VALUE_1",
        },
        method: "POST",
      });
    });
  });

  describe("UPDATE", () => {
    it("trigger correct action on update with correct compiled values", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          entity: "tests",
          id: 1,
        },
        body: {
          data: {
            age: 6,
            createdAt: new Date("2032-08-17T11:29:57.330Z"),
            name: "John Doe Updated",
            referenceId: 6,
            status: "opened",
            verified: false,
          },
        },
      });

      await detailsHandler(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(fetch).toHaveBeenCalledWith(
        "https://slack.com/api/chat.postMessage",
        {
          body: '{"channel":"UPDATE TEST","text":"John Doe Updated has the age of 6 \\n Secrets are correctly compiled CREDENTIAL_VALUE_1 \\n Constants are correctly compiled John Snow"}',
          headers: {
            Authorization: "Bearer sqlite",
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );
    });
  });

  describe("DELETE", () => {
    it("trigger correct action on delete with correct compiled values", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          entity: "tests",
          id: 1,
        },
      });

      await detailsHandler(req, res);

      expect(res._getStatusCode()).toBe(204);

      expect(fetch).toHaveBeenCalledWith("http://DELETE.TEST", {
        body: '{"data": "John Doe Updated has the age of 6"}',
        headers: {
          "empty-because-is-group-credential": "",
          "none-existent_constant": "",
          some_constant: "John Snow",
          some_credential: "CREDENTIAL_VALUE_1",
        },
        method: "POST",
      });
    });
  });
});
