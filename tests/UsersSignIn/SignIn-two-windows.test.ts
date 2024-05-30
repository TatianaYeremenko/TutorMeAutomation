import faker, { random } from "faker";

describe("SignIn from two windows:", () => {
  let userFirstName = "";

  it("Updates in user profile should automatically apply in other open users accounts", async () => {
    const { struct, page } = await createVisitor();

    // login with valid email

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill("katya.v.yeremenko@gmail.com");

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.fill("Ff22558800!");

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(2000);

    await struct.authPages.signIn.signIn.click();

    // log in in other window with the same account

    const s = await createVisitor();

    await s.struct.authPages.signIn.email.waitForVisible();
    await s.struct.authPages.signIn.email.fill("katya.v.yeremenko@gmail.com");

    await s.struct.authPages.signIn.password.waitForVisible();
    await s.struct.authPages.signIn.password.fill("Ff22558800!");

    await s.page.waitForTimeout(2000);
    await fillRecaptcha(s.struct.authPages.signIn.recaptcha);
    await s.page.waitForTimeout(2000);

    await s.struct.authPages.signIn.signIn.click();

    await s.page.waitForTimeout(2000);
    await s.struct.header.userTools.openMenu.click();

    await s.struct.userMenu.myAccount.waitForVisible();
    await s.struct.userMenu.myAccount.click();

    let phone_number = faker.datatype.number(10000000000).toString();
    // console.log(phone_number);

    // change phone number
    await s.struct.account.profile.phone.waitForVisible();
    await s.struct.account.profile.phone.fill(phone_number);

    //select where are you in life
    await s.struct.account.profile.life.select.click();
    await s.page
      .getByTestId("account.profile.life.option(career).option")
      .click();

    await s.struct.account.profile.submit.click();

    await page.reload();
    await page.waitForTimeout(1000);

    await struct.header.userTools.openMenu.click();

    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.myAccount.click();

    await page.waitForTimeout(1000);
    await page.reload();
    await struct.account.profile.life.select.click();
    await page.keyboard.press("PageDown");

    // check the phone
    expect(await struct.account.profile.phone.value()).toBe(phone_number);

    //Sign Out
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();
  });
});
