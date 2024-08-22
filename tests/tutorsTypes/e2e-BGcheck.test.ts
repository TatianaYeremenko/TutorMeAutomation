import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E BGcheck: ", () => {
  jest.setTimeout(1000000);

  const email = "tutor.bg@local.peardeck.com";
  const student_email = "qa-user-k12@local.tutorme.com";
  const password = "BGcheck1234!";

  it("Check Tutor Dashboard", async () => {
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

    await page.waitForTimeout(2000);

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
  it("Tutor with BG check is able to connect with a K-12 student", async () => {
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

    await t.page.waitForTimeout(2000);

    // submit the request
    await s.struct.homepage.requestATutor.waitForVisible();
    await s.struct.homepage.requestATutor.click();

    await s.page.locator("label").filter({ hasText: "5th grade" }).click();
    await s.struct.sessionRequest.nextArrow.click();

    await s.page.locator("label").filter({ hasText: "Other" }).click();
    await s.struct.sessionRequest.nextArrow.click();

    await s.page.locator("label").filter({ hasText: "Music" }).click();
    await s.struct.sessionRequest.nextArrow.click();

    let student_disc =
      "automation testing K-12 student requests the tutoring and connects to BG tutor";

    await s.page.getByTestId("sessionRequest.description").click();
    await s.page.getByTestId("sessionRequest.description").fill(student_disc);
    await s.page.waitForTimeout(2000);

    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

    await s.page.locator("label").filter({ hasText: "I am so lost" }).click();

    await s.page.locator("label").filter({ hasText: "Audio only" }).click();
    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(1000);

    // move to the confirmation page
    await s.struct.sessionRequest.codeOfConduct.click();
    await s.struct.sessionRequest.requestTutor.click();
    await s.page.waitForTimeout(1000);

    // a tutor get in the queue
    await t.page
      .locator('//button[@aria-label="Enter the queue? off"]')
      .click();
    await t.page.waitForTimeout(5000);

    //tutor review the request claims it
    await t.struct.modals.claimLesson.content.claim.waitForVisible();
    await t.struct.modals.claimLesson.content.claim.waitForVisible();

    await t.struct.modals.claimLesson.content.claim.click();
    await t.page.waitForTimeout(1000);

    await t.struct.modals.firstTime.content.gotIt.waitForVisible();
    await t.struct.modals.firstTime.content.gotIt.click();
    await t.page.waitForTimeout(10000);

    // student ends the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    await s.struct.modals.somethingWentWrong.content.browseTutors.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.browseTutors.click();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();

    //tutor return to the dashboard
    await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
    await t.page.waitForTimeout(1000);

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();
  });
});
