// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { entitiesController } from "../../../backend/entities/entities.controller";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(entitiesController.listAllEntities());
}
