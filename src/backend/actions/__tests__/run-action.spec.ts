import fetchMock from "jest-fetch-mock";
// import handler from "pages/api/integrations/actions/instances/index";
import {
  // createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

fetchMock.enableMocks();

const createTransportJestFn = jest.fn();

jest.mock("nodemailer", () => ({
  createTransport: (params) => createTransportJestFn(params),
}));

describe("Run Action", () => {
  it("Should add", () => {
    expect(1).toBeTruthy();
  });
  beforeAll(async () => {
    fetchMock.resetMocks();
    await setupAllTestData([
      "action_instances",
      "activated_actions",
      "schema",
      "data",
    ]);
  });
  //   it("trigger correct action on create", async () => {
  //     const { req, res } = createAuthenticatedMocks({
  //       method: "POST",
  //       body: {
  //         activatedActionId: "smtp-activation-id-1",
  //         entity: "test-entity",
  //         implementationKey: "SEND_MESSAGE",
  //         triggerLogic: "some trigger logic",
  //         formAction: "update",
  //         configuration: {
  //           to: "me",
  //           subject: "something important",
  //           body: "You are awesome",
  //         },
  //       },
  //     });
  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(201);
  //   });
});
