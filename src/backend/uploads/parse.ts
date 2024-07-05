import { configurationApiService } from "backend/configuration/configuration.service";
import { format } from "date-fns";
import formidable from "formidable";
import { mkdir, stat } from "fs/promises";
import { nanoid } from "nanoid";
import type { NextApiRequest } from "next";
import { join } from "path";
import { sluggify } from "shared/lib/strings";
import { compileTemplateString } from "shared/lib/strings/templates";

export async function parseForm(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const fileUploadSettings = await configurationApiService.show(
    "file_upload_settings"
  );
  const UPLOAD_CONFIG = {
    entity: sluggify("posts"),
    maxFileSize: 1024 * 1024 * fileUploadSettings.defaultMaxFileSizeInMB,
    fileType: "image",
    rootDir: process.cwd(),
  };

  const filePath = compileTemplateString(fileUploadSettings.filePathFormat, {
    entity: UPLOAD_CONFIG.entity,
    current_date: format(Date.now(), "dd-MM-Y"),
  });

  const uploadDir = join(UPLOAD_CONFIG.rootDir || process.cwd(), filePath);

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
      const fileNameSplitted = part.originalFilename.split(".");
      const fileExtension = fileNameSplitted.pop();

      const fileName = compileTemplateString(
        fileUploadSettings.fileNameFormat,
        {
          random_letters: nanoid(),
          file_name: fileNameSplitted.join("."),
          file_extension: fileExtension,
        }
      );
      return fileName;
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
