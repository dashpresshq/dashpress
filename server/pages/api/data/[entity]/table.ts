import type { NextApiRequest, NextApiResponse } from "next";
import { dataController } from "../../../../backend/data/data.controller";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(await dataController.tableData(req.query.model as string, req.query));
}
