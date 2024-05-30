export const domain = process.env.DOMAIN ?? "stg-tutor.peardeck.com";
export const product = process.env.PLAYWRIGHT_PRODUCT ?? "chrome";
export const verbose = process.env.VERBOSE === "true" || process.env.DEBUG === "true";
