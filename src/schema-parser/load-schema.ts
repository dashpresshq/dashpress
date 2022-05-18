const fs = require("fs/promises");

export const loadPrismaFile = async () => {
    try {
      const data = await fs.readFile("../../prisma/schema.prisma", {
        encoding: "utf8",
      });
  
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  