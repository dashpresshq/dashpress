// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { entitiesController } from "../../../../backend/entities/entities.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const entity = validateEntityFromRequest(req.query);

  res.status(200).json(entitiesController.getEntityFields(entity));
}
