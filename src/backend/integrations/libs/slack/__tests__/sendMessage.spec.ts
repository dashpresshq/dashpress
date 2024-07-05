import fetchMock from "jest-fetch-mock";

import { SEND_MESSAGE } from "../sendMessage";

fetchMock.enableMocks();

describe("SLACK => SEND_MESSAGE", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should call the send message API endpoint correctly", async () => {
    await SEND_MESSAGE.do(
      {
        token: "some-slack-token",
      },
      {
        channel: "some-slack-channel",
        message: "Some Awesome Message",
      }
    );

    expect(fetch).toHaveBeenCalledWith(
      "https://slack.com/api/chat.postMessage",
      {
        body: '{"channel":"some-slack-channel","text":"Some Awesome Message"}',
        headers: {
          Authorization: "Bearer some-slack-token",
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    );
  });
});
