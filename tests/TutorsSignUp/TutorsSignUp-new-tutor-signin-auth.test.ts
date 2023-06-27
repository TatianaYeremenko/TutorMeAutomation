import faker from "faker";

it("New tutors should be able to sign up via email", async () => {
  const { struct, page } = await createVisitor();

  //click on Apply Today  
  await struct.authPages.signIn.applyToTutor.waitForVisible();
  await struct.authPages.signIn.applyToTutor.click();

  // signup with Google is avalable
  await struct.authPages.applyToTutor.google.waitForVisible();
  
  await page.waitForTimeout(1000);
  await struct.authPages.applyToTutor.firstName.waitForVisible();
  await struct.authPages.applyToTutor.firstName.type(faker.name.firstName());
  await struct.authPages.applyToTutor.lastName.waitForVisible();
  await struct.authPages.applyToTutor.lastName.type(faker.name.lastName());

  const email = `${faker.datatype.hexaDecimal(12)}@local.tutorme.com`;
  const password = faker.internet.password(12, false, /^\w+$/, "aA1");

  await struct.authPages.applyToTutor.email.waitForVisible();
  await struct.authPages.applyToTutor.email.type(email);
  await struct.authPages.applyToTutor.password.waitForVisible();
  await struct.authPages.applyToTutor.password.type(password);
  
  await page.waitForTimeout(3000);

  await fillRecaptcha(struct.authPages.applyToTutor.recaptcha);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
    struct.authPages.applyToTutor.createAccount.click(),
  ]);
  await page.waitForTimeout(500);
  // const userData = await getUserData(page);
  // console.log(userData?.email);
  // console.log(userData?.email).toBe(email.toLowerCase());
  await page.close();

  //login with new password
  const { struct: newStuct, page: newPage } = await createVisitor();

  await newStuct.authPages.signIn.email.waitForVisible();
  await newStuct.authPages.signIn.email.type(email);

  await newStuct.authPages.signIn.password.waitForVisible();
  await newStuct.authPages.signIn.password.type(password);
  await newPage.waitForTimeout(500);

  await newStuct.authPages.signIn.recaptcha.waitForVisible();
  await fillRecaptcha(newStuct.authPages.signIn.recaptcha);

  await Promise.all([
    newPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 40_000 }),
    newStuct.authPages.signIn.signIn.click(),
  ]);

  // const newUserData = await getUserData(newPage);
  // expect(newUserData).toStrictEqual(userData);

});
