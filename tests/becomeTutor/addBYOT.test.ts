import faker, { random } from "faker";
import { product } from "../../lib/shared";
import { userEmail } from "../../lib/test-config";
describe("Create BYOT Tutor Account: ", () => {
  // names
  const userFirstName = faker.name.firstName(1);
  const userLastName = faker.name.lastName();
  const userShortName = `${userFirstName} ${userLastName.slice(0, 1)}.`;

  // create email and password
  const email = `${userFirstName}${userLastName}byot@local.tutorme.com`;
  // console.log(email);
  const password = "Tutor12345!";
  // console.log(password);

  const studentByotUser = 'qa-student-byot-umbrella@local.tutorme.com';
  const studentByotPassword = 'Byot12345!';

  it(`BYOT is added through Admin Panel - user name is ${email.toLowerCase()} and password is ${password}`, async () => {
    //create Admin
    const a = await createAdmin();

    await a.page.waitForTimeout(1000);
    await a.page.keyboard.down("PageDown");

    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')
    ).click();
    await a.page.waitForTimeout(500);

    await (
      await a.page.waitForSelector('//a[contains(text(),"Add BYOT Tutor")]')
    ).click();
    await a.page.waitForTimeout(500);

    // const email = `${faker.datatype.hexaDecimal(12)}@local.tutorme.com`;
    // const password = faker.internet.password(12, false, /^\w+$/, "aA1");

    await a.page.getByLabel("Email:").click();
    await a.page.getByLabel("Email:").fill(email);
    await a.page.getByLabel("First name:").click();
    await a.page.getByLabel("First name:").fill(userFirstName);
    await a.page.getByLabel("Last name:").click();
    await a.page.getByLabel("Last name:").fill(userLastName);

    // BYOT dropdown
    await a.page
      .getByRole("combobox", { name: "School tutor for:" })
      .selectOption("1-byot");

    // add subjects
    const subjects = [
      "Early Math",
      "Higher Math",
      "Advanced Math",
      "Statistics",
    ] as const;

    for (const item of subjects) {
      await a.page.getByLabel(item).check();
    }

    // enter User Acount and add password
    await a.page.keyboard.down("PageDown");
    await a.page
      .getByRole("button", { name: "Save and continue editing" })
      .click();

    await (
      await a.page.waitForSelector('//a[contains(text(),"User Profile")]')
    ).click();
    await a.page.waitForTimeout(500);

    await (
      await a.page.waitForSelector('//a[contains(text(),"this form")]')
    ).click();
    await a.page.waitForTimeout(500);

    await a.page.locator('//input[@id="id_password1"]').fill(password);
    await a.page.locator('//input[@id="id_password2"]').fill(password);

    await a.page.locator('//input[@value="Change password"]').click();

    await (
      await a.page.waitForSelector('//a[contains(text(),"Login as")]')
    ).click();
    await a.page.waitForTimeout(500);

    //upload picture
    const femalesExamples = [
      "./lib/tutors/females/1.jpg",
      "./lib/tutors/females/2.png",
      "./lib/tutors/females/3.png",
      "./lib/tutors/females/4.png",
      "./lib/tutors/females/5.png",
      "./lib/tutors/females/6.png",
      "./lib/tutors/females/7.png",
      "./lib/tutors/females/8.png",
    ] as const;

    await a.page.getByTestId("header.userTools.openMenu").click();
    await a.page.getByTestId("userMenu.myAccount").click();

    await (
      await a.page.waitForSelector('//div[contains(text(),"Change photo")]')
    ).click();
    await a.page.waitForTimeout(1000);

    await a.page
      .locator('//input[@id="avatarChangeFileInput"]')
      .setInputFiles(femalesExamples[faker.datatype.number(7)]);
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector(
        '//button[@data-testid="modals.changeAvatar.content.crop"]'
      )
    ).click();
    await a.page.waitForTimeout(1000);

    await a.page.keyboard.press("PageDown");
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector(
        '//div[@data-testid="account.profile.life.select"]'
      )
    ).click();
    await a.page
      .getByTestId("account.profile.life.option(career).option")
      .click();

    await a.page.getByTestId("account.profile.phone").click();
    await a.page.getByTestId("account.profile.phone").fill("124233254436436");
    await a.page.waitForTimeout(1000);

    await (
      await a.page.waitForSelector('//button[contains(text(),"Save changes")]')
    ).click();
    await a.page.waitForTimeout(1000);

    await a.page.getByTestId("header.userTools.openMenu").click();
    await a.page
      .getByRole("menuitem", { name: "Switch to tutor mode" })
      .click();

    await a.page.setViewportSize({ width: 1980, height: 1080 });
  
    await a.page
      .getByTestId("tutorDashboard.header.userTools.openMenu")
      .click();
    await a.page.getByTestId("userMenu.signOut").click();

  });

it(`Student is able to see BYO tutor when log in with ${studentByotUser} and password is ${studentByotPassword}`, async () => {

    const { struct, page } = await createVisitor();
    // sign in
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill(studentByotUser);

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(studentByotPassword);

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(2000);
    await page.setViewportSize({ width: 1680, height: 1080 });
    await page.reload();
    await page.waitForTimeout(2000);

    //student should be see the tutor
    await page.locator('//div[contains(text(),"' + userShortName +' ")]').isVisible();

    // click on user menu
    await struct.header.userTools.username.click();
    await struct.userMenu.signOut.click();
    
  });  
});