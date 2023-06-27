export const domain = process.env.DOMAIN ?? "testing.tutorme.com";
export const product = process.env.PLAYWRIGHT_PRODUCT ?? "chrome";
export const verbose = process.env.VERBOSE === "true" || process.env.DEBUG === "true";
