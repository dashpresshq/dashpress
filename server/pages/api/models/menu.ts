// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { modelController } from "../../../backend/models/models.controller";

export default function handler(req, res) {
  res.status(200).json(modelController.getModelMenuItems());
}
