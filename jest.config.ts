import type { Config } from "@jest/types";

import { product, domain, verbose } from "./lib/shared";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  reporters: verbose ? ["<rootDir>/lib/reporter.js"] : ["default"],
  setupFilesAfterEnv: ["<rootDir>/lib/setup.ts"],
  displayName: `${product} | ${domain}`,
};

if (verbose) {
  config.maxWorkers = 1;
  config.maxConcurrency = 1;
}

export default config;
