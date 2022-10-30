/* eslint-disable no-console */

(async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { StringUtils } = require("@hadmean/protozoa");
  const { default: terminalLink } = await import("terminal-link");
  const { default: c } = await import("chalk");
  const { execa } = await import("execa");

  const { default: fetch } = await import("node-fetch");
  const replaceRandomCharaters = (envContent: string) => {
    return ["ENCRYPTION_KEY", "AUTH_TOKEN_KEY"].reduce(
      (reducedEnvContent, currentKey) => {
        return reducedEnvContent.replace(
          `${currentKey}=RANDOM_CHARACTERS`,
          `${currentKey}=${StringUtils.generateRandomString(128)}`
        );
      },
      envContent
    );
  };

  const defaultEnv = () => {
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

  const copyEnvHere = () => {
    const envContent: string = fs.readFileSync(
      path.join(process.cwd(), "./.env.local"),
      "utf8"
    );

    fs.writeFileSync(
      path.join(__dirname, "../.env.local"),
      `${envContent}\nCURRENT_WORKING_DIRECTORY=${process.cwd()}`
    );
  };

  const currentPkgJson = require("../../package.json");

  process.stdout.write("\n");

  console.log(`✨ You're about to run Hadmean v${currentPkgJson.version}`);

  defaultEnv();

  copyEnvHere();

  process.stdout.write("\n");

  const endpoint = `http://localhost:${process.env.PORT || 3000}`;

  console.log(`🎉 ${terminalLink("Open the application", endpoint)}
  
      ${c.bold("Next steps:")}
  
      - ${terminalLink("Read the documentation", "https://hadmean.com")}
  
      - ${terminalLink(
        "Star Hadmean on GitHub",
        "https://github.com/hadmean/hadmean"
      )}
    `);

  const { stdout, stderr } = execa("npm", ["run", "start:prod"], {
    cwd: path.join(__dirname, ".."),
  });

  const WAIT_FOR_NEXT_TO_START = 1000;

  /*
  We want to ping the application to bootstrap itself from here
  Else it boostraps on the first request which messes a lot of things up
  We dont want the ping to crash the application if the port is not ready yet
  Hence the catch(() => {});
  */
  setTimeout(() => {
    fetch(`${endpoint}/api/healthcheck`).catch(() => {});
  }, WAIT_FOR_NEXT_TO_START);

  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
