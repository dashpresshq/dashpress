import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import { join } from "path";
import { sluggify } from "shared/lib/strings";
import { format } from "date-fns";
import { NextApiRequest } from "next";
import { nanoid } from "nanoid";

export async function parseForm(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const UPLOAD_CONFIG = {
    entity: sluggify("posts"),
    maxFileSize: 1024 * 1024 * 5,
    fileType: "image",
    rootDir: process.cwd(),
  };

  const uploadDir = join(
    UPLOAD_CONFIG.rootDir || process.cwd(),
    `/uploads/${UPLOAD_CONFIG.entity}/${format(Date.now(), "dd-MM-Y")}`
  );

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      throw e;
    }
  }

  const form = formidable({
    maxFiles: 1,
    maxFileSize: UPLOAD_CONFIG.maxFileSize,
    uploadDir,
    filename: (_name, _ext, part) => {
      return `${nanoid()}.${part.originalFilename.split(".").pop()}`;
    },
    filter: (part) => {
      return (
        part.name === "file" &&
        (part.mimetype?.includes(UPLOAD_CONFIG.fileType) || false)
      );
    },
  });

  const [fields, files] = await form.parse(req);

  return { fields, files };
}
