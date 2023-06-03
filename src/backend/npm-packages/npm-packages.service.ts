import { IApplicationService } from "backend/types";

import { execa } from "execa";
import { NPM_PACKAGES_CONFIG, NpmPackageDomain } from "./constants";

const fs = require("fs-extra");

const path = require("path");

const BASE_NPM_FILE = {
  name: "npm-temp",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  keywords: [],
  author: "Ayobami Akingbade",
  license: "ISC",
  dependencies: {},
};

export interface INpmPackage {
  packageDomain: NpmPackageDomain;
}

export class NpmPackagesApiService implements IApplicationService {
  async bootstrap() {
    await this.installPackages();
  }

  async installPackages(): Promise<void> {
    const dir = "npm-temp";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const dependencies = await this.getPackagesDependencies();

    BASE_NPM_FILE.dependencies = dependencies;

    // Also move the package.lock file there

    fs.writeFileSync(
      path.join(process.cwd(), `${dir}/package.json`),
      BASE_NPM_FILE
    );

    const { stdout, stderr } = execa("npm", ["install"], {
      cwd: path.join(process.cwd(), `${dir}`),
    });
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);

    // the move the npm packages to the node modules
  }

  async getPackagesDependencies(): Promise<Record<string, string>> {
    const packages: Record<string, string> = {};
    for (const packageConfig of Object.values(NPM_PACKAGES_CONFIG)) {
      if (await packageConfig.shouldInstall()) {
        packageConfig.packages.forEach((eachPackageDep) => {
          // :eyes Check if the package already exist then dont install
          packages[eachPackageDep.package] = eachPackageDep.version;
        });
      }
    }
    return packages;
  }
}

export const npmPackagesApiService = new NpmPackagesApiService();
