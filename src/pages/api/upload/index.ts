import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import nc from "next-connect";

// TODO validation

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  })
  .use(upload.single("file"))
  .options((req, res) => {
    res.json({});
  })
  .post((req, res) => {
    res.json({ hello: "world", fileUrl: req.file });
  });

export default handler;

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
