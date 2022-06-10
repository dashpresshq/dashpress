// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { entitiesController } from "../../../backend/entities/entities.controller";

export default function handler(req, res) {
  res.status(200).json(entitiesController.listAllEntities());
}
