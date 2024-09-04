import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E BGcheck: ", () => {
  jest.setTimeout(1000000);

  const email = "tutor.nobg@local.peardeck.com";
  const password = "NoBGcheck1234!";

  it("Check Tutors with No BG check Dashboard", async () => {
    const { struct, page } = await createVisitor();
    // sign in

    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill(email.toLowerCase());

    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.type(password);

    await page.waitForTimeout(2000);
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await page.waitForTimeout(1000);

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();

    await page.waitForTimeout(5000);

    // availableTutoring, past tutoring, earnings, heatmap, background check and resorcies should be avalable
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await struct.tutorDashboard.header.earnings.waitForVisible();
    await struct.tutorDashboard.header.heatmap.waitForVisible();
    await struct.tutorDashboard.header.checkr.waitForVisible();
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();
    await struct.tutorDashboard.header.helpCenter.waitForVisible();

    // on Resources page in Getting Started section only these links should be avalaible
    await struct.tutorDashboard.header.resources.click();

    // Getting Started
    // Read the entire Tutor Handbook
    await struct.tutorDashboard.resources.handbook.waitForVisible();
    // Enable Desktop Notifications
    await struct.tutorDashboard.resources.notifications.waitForVisible();
    // Get familiar with the Demo Lesson Space
    await struct.tutorDashboard.resources.demoLessonSpace.waitForVisible();
    // Make sure your Tutor Profile and Subjects are current
    await struct.tutorDashboard.resources.tutorProfile.waitForVisible();
    // Visit the Tutor Help Center. Still need help? Contact Us
    await struct.tutorDashboard.resources.helpCenter.waitForVisible();

    //SHOUL NOT BE VISIBLE:
    await struct.tutorDashboard.resources.writingLabComments.waitForHidden();
    await struct.tutorDashboard.resources.writingLabTips.waitForHidden();
    await struct.tutorDashboard.resources.handbookWritingLab.waitForHidden();

    // account menu
    await struct.tutorDashboard.header.userTools.username.click();

    // My Account should be visiable
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.editProfile.waitForVisible();
    await struct.userMenu.switch.waitForVisible();

    // Privacy Policy and Terms of Service links are available
    await (
      await page.waitForSelector('//a[contains(text(),"Privacy Policy")]')
    ).waitForElementState("visible");
    await (
      await page.waitForSelector('//a[contains(text(),"Terms of Service")]')
    ).waitForElementState("visible");

    //tutor signs out
    await struct.userMenu.signOut.click();
  });
  it("Tutor with No BG should not be available for K-12 students but should be available for others", async () => {
    // create tutor
    const t = await createVisitor();

    // create tutor
    const s = await createQaUser("studentWithUmbrella");

    // the tutor signs in
    await t.struct.authPages.signIn.email.waitForVisible();
    await t.struct.authPages.signIn.email.fill(email.toLowerCase());

    await t.struct.authPages.signIn.password.waitForVisible();
    await t.struct.authPages.signIn.password.type(password);

    await t.page.waitForTimeout(2000);
    await fillRecaptcha(t.struct.authPages.signIn.recaptcha);
    await t.page.waitForTimeout(1000);

    await t.struct.authPages.signIn.signIn.waitForVisible();
    await t.struct.authPages.signIn.signIn.click();
    await t.page.waitForTimeout(5000);


    // check a tutor in Tutors Page
    await s.page.reload();
    await s.page.waitForTimeout(2000);
    await s.struct.header.browseTutors.waitForVisible();
    await s.struct.header.browseTutors.click();

    await s.struct.tutors.filter.category(10001).waitForVisible();
    await s.struct.tutors.filter.category(10001).click();
    await s.page.waitForTimeout(2000);
    
    // await s.page.locator('//h3[contains(text(),"Richard P.")]').isHidden();
    await s.struct.tutors.tutor(261204).name.waitForHidden();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();

    //login with billing 
    const b = await createQaUser('studentWithBilling');

    await b.page.waitForTimeout(2000);
    await b.struct.header.browseTutors.waitForVisible();
    await b.struct.header.browseTutors.click();
    
    // check a tutor in Tutors Page
    await b.struct.tutors.filter.category(10001).waitForVisible();
    await b.struct.tutors.filter.category(10001).click();
    await b.page.waitForTimeout(2000);
    await b.page.reload();
    await b.page.waitForTimeout(2000);

    
    // await b.page.locator('//h3[contains(text(),"Richard P.")]').isVisible();
    await b.struct.tutors.tutor(261204).name.waitForVisible();

    // click on user menu
    await b.struct.header.userTools.username.click();
    await b.struct.userMenu.signOut.click();

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();
  });
});
