/* eslint-disable no-console */

// Support port
(async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { StringUtils } = require("@hadmean/protozoa");
  const { default: terminalLink } = await import("terminal-link");
  const { default: c } = await import("chalk");
  const { default: ora } = await import("ora");
  const { execa } = await import("execa");

  const replaceRandomCharaters = (envContent: string) => {
    return ["ENCRYPTION_KEY", "AUTH_TOKEN_KEY"].reduce(
      (reducedEnvContent, currentKey) => {
        return reducedEnvContent.replace(
          `${currentKey}=RANDOM_CHARACTERS`,
          `${currentKey}=${StringUtils.generateRandomGibberish(64)}`
        );
      },
      envContent
    );
  };

  const moveEnv = () => {
    if (fs.existsSync(path.join(process.cwd(), "./.env.local"))) {
      return;
    }

    const envContent: string = fs.readFileSync(
      path.join(__dirname, "../.env.example"),
      "utf8"
    );

    fs.writeFileSync(
      path.join(process.cwd(), "./.env.local"),
      replaceRandomCharaters(envContent)
    );
  };

  const startApplication = async () => {
    const spinner = ora(
      "Building your application. This may take a few minutes."
    ).start();

    try {
      await execa("npm", ["run", "build"], {
        cwd: path.join(__dirname, ".."),
      });

      fs.moveSync(
        path.join(__dirname, "../.next"),
        path.join(process.cwd(), "./.next")
      );

      spinner.succeed("App built successfully");
    } catch (_err: any) {
      const err = _err;
      if (err.failed) {
        spinner.fail("Failed to build application.");
        process.exit(1);
      }
      throw err;
    }
  };

  const currentPkgJson = require("../../package.json");

  console.log(`✨ You're about to run Hadmean v${currentPkgJson.version}`);

  moveEnv();

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

  execa("npm", ["run", "start"]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
