import { requestHandler } from "../../backend/lib/request";

const currentPkgJson = require("../../../package.json");

export default requestHandler(
  {
    GET: async (): Promise<Record<string, string>> => {
      return {
        Hadmean: currentPkgJson.version,
        Node: process.versions.node,
      };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
