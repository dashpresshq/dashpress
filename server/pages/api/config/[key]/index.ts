import type { NextApiRequest, NextApiResponse } from "next";
import { configurationController } from "../../../../backend/configuration/configuration.controller";
import { validateConfigKeyFromRequest } from "../../../../backend/configuration/configuration.validations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = validateConfigKeyFromRequest(req.query);
  if (req.method === "GET") {
    return res
      .status(200)
      .json(await configurationController.showConfig(key));
  } else if (req.method === "PUT") {
    return res
      .status(204)
      .json(
        await configurationController.upsertConfig(
          key,
          req.body.data
        )
      );
  }
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
