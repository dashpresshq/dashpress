import { dataController } from "../../../../backend/data/data.controller";

export default async function handler(req, res) {
  res.status(200).json(await dataController.tableData(req.query.model, req.params));
}
