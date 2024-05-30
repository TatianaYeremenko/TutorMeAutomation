import { isConditionalExpression } from "typescript";
import { userEmail, userPassword } from "../../lib/test-config";

describe("sign in - ", () => {
  it("user is able to login and logout", async () => {
    const { struct, page } = await createVisitor();

    // sign in

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.type("tutorme.testing.now@gmail.com");

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type("Tt22558800!");

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(2000);

    await struct.header.userTools.username.waitForVisible();

    expect(await struct.header.userTools.username.text()).toBe("Fillip K.");
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.waitForVisible();
    await struct.userMenu.signOut.click();
  });
});
