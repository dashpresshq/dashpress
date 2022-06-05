// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import { schemaController } from "../../../backend/schema/schema.controller";

export default function handler(req, res) {
  res
    .status(200)
    .json({ data: [], pageIndex: 1, pageSize: 10, totalRecord: 0 });
}
