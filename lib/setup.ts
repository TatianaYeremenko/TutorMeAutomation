import { source, StructRecord } from "@tutorme/sitestruct";
import playwright from "playwright";
import ora from "ora";
import { rename } from "fs/promises";
import { parse } from "superjson";
import { keys, replace, unescape } from "lodash";
import { z } from "zod";

import { domain, verbose, product } from "./shared";

type TestContext = {
  context: playwright.BrowserContext;
  page: Page;
};

const testContexts: TestContext[] = [];

const BASE_URL = `https://${domain}`;

process.on("unhandledRejection", console.warn);

jest.setTimeout(1000000);

let browser: playwright.Browser;

const isDebug = process.env.DEBUG === "true";
const delay = parseInt(process.env.DELAY ?? "0") || 0;
const width = 1200;
const height = 768;

// By default, the Playwright tests run on a default viewport size of 1280x720 .
//1024x768, 1280x960, 1280x1024, 1600x1200 and 1920x1080
//await page.setViewportSize({ width: 1600, height: 1200 });

beforeAll(async () => {
  if (product === "firefox") {
    browser = await playwright.firefox.launch({
      headless: !isDebug,
    });
  } else if (product === "safari") {
    browser = await playwright.webkit.launch({
      headless: !isDebug,
    });
  } else {
    browser = await playwright.chromium.launch({
      headless: !isDebug,
      args: [
        "--disable-notifications",
        "--start-maximized",
        `--window-size=${width},${height}`,
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
        "--disable-gpu",
      ],
    });
  }
});

// BrowserStack set-up

// const cp = require('child_process');
// const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];  // This is used to get the installed Playwright version on you machine. The same needs to be passed on to BrowserStack so that proper request-response mapping can be done for mismatched client and server Playwright versions in the same test

// // Windows (10, 11): 1024x768, 1280x800, 1280x1024, 1366x768, 1440x900, 1680x1050, 1600x1200, 1920x1200, 1920x1080 and 2048x1536
// // OS X: 1024x768, 1280x960, 1280x1024, 1600x1200, 1920x1080, 2560x1440, 2560x1600 and 3840x2160


// beforeAll(async () => {
//     const { chromium } = require('playwright');
//     const caps_chromium = {
//       'resolution': '1280x960',
//       'browser': 'playwright-chromium',
//       'os': 'os x',
//       'os_version': 'mojave',
//       'browserstack.username': process.env.BROWSERSTACK_USERNAME || 'tatianayeremenko_JlyFfZ',
//       'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY || 'Rph1bdhyrtxFJbvnEqHt',
//       'client.playwrightVersion': clientPlaywrightVersion
//     };

//     browser = await chromium.connect({
//       wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps_chromium))}`
//     });
//   });


afterAll(async () => {
  await browser.close();
});

afterEach(async () => {
  let context: TestContext | undefined;
  let index = 0;
  while ((context = testContexts.shift())) {
    index++;
    const videoPath = await context.page.video()?.path();
    if (videoPath) {
      await rename(
        videoPath,
        `./videos/${expect.getState().currentTestName.replace(/\//g, "")} #${index}.webm`
      );
    }
    await context.context.close();
    await context.page.close();
  }
});

if (verbose) {
  beforeEach(() => {
    process.stderr.write(`\n=== ${expect.getState().currentTestName} ===\n`);
      jest.setTimeout(10000);
  });
}

async function withOra<T>(
  text: string,
  fn: (log: (message: string) => void) => Promise<T>
): Promise<T> {
  if (!verbose) {
    return fn(() => undefined);
  }
  let spinner: ora.Ora;
  const promise = fn((message) => {
    spinner.text = message;
  });
  spinner = ora.promise(promise, text);
  return promise.then(async (res) => {
    await sleep(delay);
    return res;
  });
}

global.launchBrowser = async function launchBrowser(url: string) {
  const context = await browser.newContext();
  await context.grantPermissions(["notifications"]);
  const page = await browser.newPage({
    recordVideo:
      process.env.RECORD_VIDEO === "true"
        ? {
            dir: "./video",
            size: {
              width,
              height,
            },
          }
        : undefined,
    screen: {
      width,
      height,
    },
    viewport: {
      width,
      height,
    },
  });
  testContexts.push({ context, page });
  await page.addInitScript("window.chrome={runtime:{}}");
  await page.goto(url, { waitUntil: "domcontentloaded" });
  return page;
};

global.qaUserButtons = {
  student: "regular",
  studentWithBilling: "with_billing",
  studentWithUmbrella: "umbrella",
  tutor: "approved",
};

global.createVisitor = function createVisitor() {
  return withOra("create visitor", async () => {
    const page = await launchBrowser(BASE_URL);
    await page.waitForFunction("window.tutormeLoaded", { timeout: 10000 });
    // //click on Cookies Banner     
    // const cookieBanner = await page.waitForSelector('//button[contains(text(),"Accept Cookies")]');
    // await cookieBanner.click();

    await page.setViewportSize({
      // width: 1024,
      // height: 768,
      width: width,
      height: height,
    });

    return {
      page,
      struct: buildApi(page, source),
    };
  });
};



global.createAdmin = function createAdmin() {
  return withOra("create admin", async () => {
    const page = await launchBrowser(`${BASE_URL}/api/v1/qa/`);
    const mode = "very_secret_admin";
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.setAttribute("type", "submit");
      input.setAttribute("name", "very_secret_admin");
      document.querySelector("form")?.appendChild(input);
    });
    await page.click(`[name='${mode}']`, { timeout: 10000 });
    return {
      page,
    };
  });
};

global.createQaUser = function createQaUser(kind: keyof typeof qaUserButtons) {
  return withOra(`create ${kind}`, async (log) => {
    const mode = qaUserButtons[kind];
    if (!mode) {
      throw new Error(`Unknown user kind: "${kind}"`);
    }
    const page = await launchBrowser(`${BASE_URL}/api/v1/qa/`);
    await page.click(`[name='${mode}']`, { timeout: 10000 });
    await page.waitForFunction("window.tutormeLoaded", { timeout: 10000 });
        
    // //click on Cookies Banner     
    // const cookieBanner = await page.waitForSelector('//button[contains(text(),"Accept Cookies")]');
    // await cookieBanner.click();

    const user = await getUserData(page);
    if (!user) {
      throw new Error("Can't get user data");
    }
    log(`${kind} ${user.id} created`);
    return {
      page,
      user,
      struct: buildApi(page, source),
    };
  });
};

global.createQaTutor = function createQaTutor() {
  return withOra(`create tutor`, async (log) => {
    const mode = 'approved';
    if (!mode) {
      throw new Error(`Unknown user kind`);
    }
    const page = await launchBrowser(`${BASE_URL}/api/v1/qa/`);
    await page.click(`[name='${mode}']`, { timeout: 10000 });
    await page.waitForFunction("window.tutormeLoaded", { timeout: 10000 });
        
    await (await page.waitForSelector('//button[contains(text(),"Review your subjects")]')).click();
    await page.waitForTimeout(100);
    await page.getByRole("button", { name: "Save selections" }).click();
    await page.waitForTimeout(100);
    await (await page.waitForSelector('//a[contains(text(),"Go to your account")]')).click();

    const user = await getUserData(page);
    if (!user) {
      throw new Error("Can't get user data");
    }
    log(`tutor created`);
    return {
      page,
      user,
      struct: buildApi(page, source),
    };
  });
};




global.sleep = function sleep(ms: number) {
  if (!ms) {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
};

global.fillRecaptcha = function (element: IElementApi) {
  const concreteElement = element as ElementApi;
  return withOra(`fill recaptcha ${concreteElement.testId}`, async () => {
    const handle = await element.waitForVisible();
    const recaptchaFrame = await handle
      .waitForSelector("iframe", { state: "visible", timeout: 10000 })
      .then((frame) => frame.contentFrame());
    if (!recaptchaFrame) {
      throw new Error("recaptcha frame not found");
    }
    await recaptchaFrame.click("#recaptcha-anchor-label", { timeout: 10000 });
    await recaptchaFrame.waitForSelector(".recaptcha-checkbox-checkmark", {
      state: "visible",
      timeout: 10000,
    });
    await sleep(100);
  });
};


const reduxStateZ = z.object({
  auth: z.object({
    user: z
      .object({
        id: z.number(),
        firstName: z.string(),
        lastName: z.string(),
        shortName: z.string(),
        email: z.string(),
        mode: z.enum(["student", "tutor"]),
      })
      .optional(),
  }),
});

global.getUserData = async function getUserData(page: Page): Promise<UserData | undefined> {
  const stateScript = await page.waitForSelector("#--redux-state", { state: "attached" });
  const textContent = await stateScript.innerHTML();
  const userData = parse(unescape(textContent));
  return reduxStateZ.parse(userData).auth.user;
};

class ElementApi implements IElementApi {
  protected readonly selector = `[data-testid='${this.testId}']`;

  constructor(protected readonly page: Page, public readonly testId: string) {}
  async exists() {
    const handle = await this.page.$(this.selector);
    return !!handle;
  }

  waitForVisible(options?: { timeout: number }) {
    return withOra(`wait for visible ${this.testId}`, async () => {
      const handle = await this.page.waitForSelector(this.selector, {
        timeout: 2000,
        state: "visible",
        ...options,
      });
      return handle as ElementHandle;
    });
  }

  waitForHidden(options?: { timeout: number }) {
    return withOra(`wait for hidden ${this.testId}`, async () => {
      const handle = await this.page.waitForSelector(this.selector, {
        timeout: 1000,
        state: "hidden",
        ...options,
      });
      return handle as ElementHandle;
    });
  }

  async text() {
    return (await this.page.textContent(this.selector, { strict: true })) ?? "";
  }
  
}

class ButtonApi extends ElementApi implements IButtonApi {
  click() {
    return withOra(`click ${this.testId}`, async () => {
      await this.page.click(this.selector, { strict: true });
    });
  }
  check() {
    return withOra(`check ${this.testId}`, async () => {
      await this.page.check(this.selector, { strict: true });
    });
  }
  uncheck() {
    return withOra(`uncheck ${this.testId}`, async () => {
      await this.page.uncheck(this.selector, { strict: true });
    });
  }
  async isChecked() {
    return (await this.page.isChecked(this.selector, { strict: true })) ?? "";
  }
}

class InputApi extends ElementApi implements IInputApi {
  type(value: string) {
    return withOra(`type ${JSON.stringify(value)} into ${this.testId}`, async () => {
      await this.page.type(this.selector, value, { delay: 200, strict: true });
    });
  }

  fill(value: string) {
    return withOra(`fill ${JSON.stringify(value)} into ${this.testId}`, async () => {
      return await this.page.fill(this.selector, value);
    });
  }
  
  
  press(key: string): Promise<void> {
    return withOra(`press ${JSON.stringify(key)} into ${this.testId}`, async () => {
      await this.page.press(this.selector, key, { delay: 50, strict: true });
    });
  }
  clear() {
    return withOra(`clear ${this.testId}`, async () => {
      await this.page.fill(this.selector, '');
    });
  }

  click() {
    return withOra(`click ${this.testId}`, async () => {
      await this.page.click(this.selector, { strict: true });
    });
  }
  
  selectFiles(files: string | string[]) {
    return withOra(`select ${JSON.stringify(files)} into ${this.testId}`, async () => {
      await this.page.setInputFiles(this.selector, files );
    });
  }

  value() {
    return this.page.inputValue(this.selector, { strict: true });
  }

  focus() {
    return withOra(`focus ${this.testId}`, async () => {
      await this.page.focus(this.selector, { strict: true });
    });
  }
}

class ModalApi<T> extends ElementApi implements IModalApi<T> {
  constructor(page: Page, testId: string, public readonly content: ApiFor<T>) {
    super(page, testId);
  }

  close() {
    return withOra(`close modal ${this.testId}`, async () => {
      const handle = await this.page.$("[data-testid='modals.overlay']");
      if (!handle) {
        throw new Error("Modal overlay not found");
      }
      const box = await handle.boundingBox();
      if (!box) {
        throw new Error("Modal overlay not found");
      }
      await this.page.mouse.move(box.x + 1, box.y + 1);
      await this.page.mouse.down();
      await this.page.mouse.up();
    });
  }
}
function buildApi<T extends StructRecord[string]>(
  page: Page,
  rec: T,
  key = "",
  asModal = false
): ApiFor<T> {
  if (typeof rec === "string") {
    switch (rec) {
      case "button":
        return new ButtonApi(page, key) as any;
      case "input":
        return new InputApi(page, key) as any;
      case "div":
        return new ElementApi(page, key) as any;
    }
  }
  if (asModal) {
    return new ModalApi<any>(page, key, buildApi(page, rec, `${key}.content`) as any) as any;
  }
  return Object.keys(rec).reduce((acc, k) => {
    const newKey = k.replace(/(Modal|ById)$/, "");
    const childApi = (suffix: string) =>
      buildApi(
        page,
        (rec as any)[k],
        key === "" ? k : `${key}.${newKey}${suffix}`,
        k.endsWith("Modal")
      );
    acc[newKey] = k.endsWith("ById") ? (id: number) => childApi(`(${id})`) : childApi("");
    return acc;
  }, {} as any);
}
