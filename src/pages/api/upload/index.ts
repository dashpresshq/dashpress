import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import nc from "next-connect";

// TODO auth validation

const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  filename: (_, file, callback) => {
    // originalname is the uploaded file's name with extn
    callback(null, file.originalname);
  },
});

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (_1, _2, res) => {
    res.status(500).end("Something broke!");
  },
  onNoMatch: (_, res) => {
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
  .options((_, res) => {
    res.json({});
  })
  .post((req, res) => {
    // Move the file
    res.json({ hello: "world", fileUrl: (req as any).file.path });
  });

export default handler;

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

// TODO
// disable file upload in DEMO
// Max Size
// file type
