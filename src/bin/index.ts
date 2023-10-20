/* eslint-disable no-console */
import * as randomstring from "randomstring";
import { checkNodeVersion } from "./checkNodeVersion";
// TODO test this compiles well
(async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { default: terminalLink } = await import("terminal-link");
  const { execa } = await import("execa");

  const { default: fetch } = await import("node-fetch");

  const generateRandomString = (length = 12): string => {
    return randomstring.generate(length);
  };

  const replaceRandomCharaters = (envContent: string) => {
    return ["CREDENTIALS_ENCRYPTION_KEY", "AUTH_TOKEN_KEY"].reduce(
      (reducedEnvContent, currentKey) => {
        return reducedEnvContent.replace(
          `${currentKey}=RANDOM_CHARACTERS`,
          `${currentKey}=${generateRandomString(128)}`
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
  // https://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=dashpress
  console.log(`
       /$$                     /$$                                                       
      | $$                    | $$                                                       
  /$$$$$$$  /$$$$$$   /$$$$$$$| $$$$$$$   /$$$$$$   /$$$$$$   / $$$$$$   /$$$$$$$ /$$$$$$$
 /$$__  $$ |____  $$ /$$_____/| $$__  $$ / $$__  $$/ $$__  $$ / $$__  $$ /$$_____//$$_____/
| $$  | $$  /$$$$$$$|  $$$$$$ | $$ \\ $$ | $$ \\ $$| $$  \\__/| $$$$$$$$|  $$$$$$|  $$$$$$ 
| $$  | $$ /$$__  $$ \\____$$ | $$  | $$ | $$  | $$| $$       | $$_____/\\____ $$\\____ $$
|  $$$$$$$|  $$$$$$$ /$$$$$$$/| $$  | $$ | $$$$$$$/| $$       | $$$$$$$ /$$$$$$$//$$$$$$$/
\\_______/ \\_______/|_______/ |__/  |__/| $$____/ |__/       \\_______/|_______/|_______/ 
                                         | $$                                             
                                         | $$                                             
                                         |__/                                             

  `);

  console.log(`🟢 You're about to run DashPress v${currentPkgJson.version}`);

  if (!checkNodeVersion().status) {
    console.log("");
    console.warn(`🟨 ${checkNodeVersion().message}`);
  }

  defaultEnv();

  copyEnvHere();

  process.stdout.write("\n");

  const endpoint = `http://localhost:${process.env.PORT || 3000}`;

  console.log(`- ${terminalLink(
    "💗 Show us support by dropping a ✨ at github.com/dashpresshq/dashpress",
    "https://github.com/dashpresshq/dashpress"
  )}

- ${terminalLink(
    "💬 If you have questions? Join our community",
    "https://discord.gg/aV6DxwXhzN"
  )}
    `);

  // TODO Doing the npm package thing here

  const { stdout, stderr } = execa("npm", ["run", "start"], {
    cwd: path.join(__dirname, ".."),
  });

  const WAIT_FOR_NEXT_TO_START = 1000;

  console.log(
    `🚀 Application started successfully at ${terminalLink(endpoint, endpoint)}`
  );

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
