import faker, {
    random
  } from "faker";

  describe('SignIn from two windows:', () => {
    let userFirstName = ''

  it('Updates in user profile should automatically apply in other open users accounts', async () => {
    const {
        struct,
        page
    } = await createVisitor();

  //click on Apply Today  
  await struct.authPages.signIn.applyToTutor.waitForVisible();
  await struct.authPages.signIn.applyToTutor.click();

  // signup with Google is avalable
  await struct.authPages.applyToTutor.google.waitForVisible();

    //fill 
    const userFirstName = faker.name.firstName(0);
    const userLastName = faker.name.lastName();
    const userShortName = `${userFirstName} ${userLastName.slice(0,1)}.`

    //enter names
    await struct.authPages.applyToTutor.firstName.fill(userFirstName);
    await struct.authPages.applyToTutor.lastName.fill(userLastName);
  
    //create email and password
    const email = `${userFirstName}${userLastName}Test@local.tutorme.com`;
    const password = faker.internet.password(12, false, /^\w+$/, "aA1");
  
    await struct.authPages.applyToTutor.email.fill(email.toLowerCase());
    await struct.authPages.applyToTutor.password.fill(password);
    
    // checked Recaptcha
    await struct.authPages.applyToTutor.recaptcha.waitForVisible();
    await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);
  
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10_000 }),
      struct.authPages.applyToTutor.createAccount.click()
    ]);

    // log in in other window

    const s = await  createVisitor();

    // click on sign in

    await s.struct.authPages.signIn.email.waitForVisible();
    await s.struct.authPages.signIn.email.fill(email);

    await s.struct.authPages.signIn.password.waitForVisible();
    await s.struct.authPages.signIn.password.fill(password);

    await s.page.waitForTimeout(2000);
    await fillRecaptcha(s.struct.authPages.signIn.recaptcha);
   
    await s.struct.authPages.signIn.signIn.waitForVisible();
    await s.struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(1000);

    await s.struct.header.userTools.avatar.waitForVisible();
    await s.struct.header.userTools.avatar.click();

    await s.struct.userMenu.myAccount.waitForVisible();
    await s.struct.userMenu.myAccount.click();

    // change phone number

    await s.struct.account.profile.phone.waitForVisible();
    await s.struct.account.profile.phone.fill('123456789012344');

    //select where are you in life
    await s.struct.account.profile.life.select.click();
    await s.struct.account.profile.life.select.type('Career');
    await s.struct.account.profile.life.select.press('ArrowDown');
    await s.struct.account.profile.life.select.press('Enter'); 

    await s.struct.account.profile.submit.waitForVisible();
    await s.struct.account.profile.submit.click();

    await page.reload();

    await struct.header.userTools.avatar.waitForVisible();
    await struct.header.userTools.avatar.click();

    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.myAccount.click();

    await page.waitForTimeout(1000);
    await page.reload();
    await struct.account.profile.life.select.click();
    await page.keyboard.press('PageDown');

    // check the phone
    expect(await struct.account.profile.phone.value()).toBe('123456789012344');

    //Sign Out
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();

   });
});