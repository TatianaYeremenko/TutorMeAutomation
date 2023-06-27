import faker, {
    random
  } from "faker";

  describe('Recaptcha:', () => {
    let userFirstName = ''

  it('check with expired recaptcha', async () => {
    const {
        struct,
        page
    } = await createVisitor();

    // click on sign in
    await struct.header.signIn.waitForVisible();
    await struct.header.signIn.click();

    // signup modal pop-up
    await struct.modals.signIn.content.signUp.waitForVisible();
    await struct.modals.signIn.content.signUp.click();

    //Continue with Email
    await struct.modals.signUp.content.useEmail.waitForVisible();
    await struct.modals.signUp.content.useEmail.click();

    //fill 
    const userFirstName = faker.name.firstName(0);
    const userLastName = faker.name.lastName();
    const userShortName = `${userFirstName} ${userLastName.slice(0,1)}.`

    //enter names
    await struct.modals.emailSignUp.content.firstName.type(userFirstName);
    await struct.modals.emailSignUp.content.lastName.type(userLastName);
  
    //create email and password
    const email = `${userFirstName}${userLastName}Test@local.tutorme.com`;
    const password = faker.internet.password(12, false, /^\w+$/, "aA1");
  
    await struct.modals.emailSignUp.content.email.fill(email.toLowerCase());
    await struct.modals.emailSignUp.content.password.fill(password);
    
    // checked Recaptcha
    await struct.modals.emailSignUp.content.recaptcha.waitForVisible();
    await fillRecaptcha(struct.modals.emailSignUp.content.recaptcha);
    await struct.modals.emailSignUp.content.signUp.waitForVisible();

    await page.waitForTimeout(70000);
  
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10_000 }),
      struct.modals.emailSignUp.content.signUp.click()
    ]);

    await struct.modals.emailSignUp.content.recaptchaError.waitForVisible();
    console.log(struct.modals.emailSignUp.content.recaptchaError.text);

    await fillRecaptcha(struct.modals.emailSignUp.content.recaptcha);
    await struct.modals.emailSignUp.content.signUp.waitForVisible();

    //Sign Out
    await struct.header.userTools.username.waitForHidden();
    await struct.userMenu.signOut.click();

   });
});