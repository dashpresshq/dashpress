import type { NextApiRequest, NextApiResponse } from "next";
import { configurationController } from "../../../../backend/configuration/configuration.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res
      .status(200)
      .json(
        await configurationController.showConfig(
          req.query.key as string,
        )
      );
      // TODO replace with PUT
  } else if (req.method === "PATCH") {
    res
      .status(204)
      .json(
        await configurationController.upsertConfig(
          req.query.key as string,
          req.body.data,
        )
      );
  }
  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
