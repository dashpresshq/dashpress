// Support port
(async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { default: terminalLink } = await import("terminal-link");
  const { default: c } = await import("chalk");
  const { default: ora } = await import("ora");
  const { execa } = await import("execa");

  const startApplication = async () => {
    const spinner = ora(
      "Building your application. This may take a few minutes."
    ).start();
    try {
      await execa("npm", ["run", "build:next"]);

      spinner.succeed("App build successfully");
    } catch (_err: any) {
      const err = _err;
      if (err.failed) {
        spinner.fail("Failed to build application.");
        process.stdout.write("\n");
        return;
      }
      throw err;
    }
  };

  const currentPkgJson = require("../../package.json");

  console.log(`✨ You're about to TODO run Hadmean v${currentPkgJson.version}`);

  await fs.copyFile(
    path.join(__dirname, "../.env.example"),
    path.join(process.cwd(), "./.env.local")
  );

  // TODO mangle the .env.example

  process.stdout.write("\n");

  await startApplication();

  process.stdout.write("\n");

  console.log(`🎉 ${terminalLink(
    "Open the application",
    "http://localhost:3000"
  )}
  
      ${c.bold("Next steps:")}
  
      - Edit the generated ${c.bold(`.env.local`)} to your desire.
  
      - ${terminalLink(
        "Know all you can do with Hadmean",
        "https://docs.hadmean.com"
      )}
  
      - ${terminalLink(
        "Star Hadmean on GitHub",
        "https://github.com/hadmean/hadmean"
      )}
    `);

  await execa("npm", ["run", "start"]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
