import type { NextApiRequest, NextApiResponse } from "next";
import { dataController } from "../../../../backend/data/data.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const entity = validateEntityFromRequest(req.query);

  res.status(200).json(await dataController.tableData(entity, req.query));
}
