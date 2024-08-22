import faker, { random } from "faker";
import { product } from "../../lib/shared";

//https://tutorme247.atlassian.net/browse/TM-1175
describe("E2E BYOT: ", () => {
  jest.setTimeout(1000000);

  const email = "tutor.byot@local.peardeck.com";
  const password = "BYOTcheck1234!";
  const student_email = "qa-user--byot@local.tutorme.com";

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

    await page.setViewportSize({ width: 1280, height: 720 });

    //CHECK DASHBOARD HERE:
    //https://tutorme247.atlassian.net/browse/TM-1175

    // check if the earning is not visible
    await struct.tutorDashboard.header.earnings.waitForHidden();

    // check if the Background Check and HeatMap is not visible
    await struct.tutorDashboard.header.checkr.waitForHidden();
    await struct.tutorDashboard.header.heatmap.waitForHidden();
    await page.waitForTimeout(1000);

    // check if the everything elase is avalble
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.resources.click();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.click();
    await struct.tutorDashboard.header.demoLessonSpace.waitForVisible();

    await struct.tutorDashboard.header.userTools.username.click();

    await struct.userMenu.privacyPolicy.waitForVisible();
    await struct.userMenu.terms.waitForVisible();
    await struct.userMenu.myAccount.waitForVisible();
    await struct.userMenu.editProfile.waitForVisible();
    await struct.userMenu.switch.waitForVisible();

    //tutor signs out
    await struct.userMenu.signOut.click();
  });
  it("BYOT  is able to connect a BYOT account student", async () => {
    // create tutor
    const t = await createVisitor();

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

    // the student signs in
    const s = await createVisitor();

    await s.struct.authPages.signIn.email.waitForVisible();
    await s.struct.authPages.signIn.email.type(student_email.toLowerCase());

    await s.struct.authPages.signIn.password.waitForVisible();
    await s.struct.authPages.signIn.password.type(password);

    await s.page.waitForTimeout(1000);
    await fillRecaptcha(s.struct.authPages.signIn.recaptcha);
    await s.page.waitForTimeout(1000);

    await s.struct.authPages.signIn.signIn.waitForVisible();
    await s.struct.authPages.signIn.signIn.click();

    await s.page.waitForTimeout(1000);

    await s.page.setViewportSize({ width: 1980, height: 1060 });
    //  await s.page.setViewportSize({ width: 1280, height: 720 });

    await s.page.reload();
    await s.page.waitForTimeout(1000);

    // submit the request
    await s.struct.roster.schoolContacts
      .contact(183000)
      .college.waitForVisible();
    await s.struct.roster.schoolContacts.contact(183000).name.waitForVisible();

    await s.struct.roster.schoolContacts.contact(183000).openChat.click();
    await s.page.waitForTimeout(1000);
    await s.page.getByRole("button", { name: "Request a session" }).click();
    await s.page.waitForTimeout(1000);

    // await s.struct.chat(183000).header.startLesson.waitForVisible();
    // await s.struct.chat(183000).header.startLesson.click();
    // await s.page.waitForTimeout(1000);

    // select a subject form modal
    await s.struct.modals.connectTutor.content.subjectSelect.click();
    await s.struct.modals.connectTutor.content
      .option(10004)
      .option.waitForVisible();
    await s.struct.modals.connectTutor.content.option(10004).option.click();
    await s.page.keyboard.press("Enter");
    await s.page.waitForTimeout(1000);

    let student_disc =
      "automation testing K-12 student requests the tutoring and connects to BYOT";

    //Describe your question
    await s.page.getByTestId("sessionRequest.description").click();
    await s.struct.sessionRequest.description.type(student_disc);

    // close button is avalable
    await s.struct.modals.connectTutor.content.close.waitForVisible();

    // Code of Conduct
    await s.struct.sessionRequest.codeOfConduct.check();

    // await s.page.getByTestId('modals.connectTutor.content.option(10016).option').click();
    await s.page.getByRole("button", { name: "Send session request" }).click();
    await s.page.waitForTimeout(1000);

    //tutor review the request claims it
    await t.struct.modals.request.content.accept.waitForVisible();
    await t.struct.modals.request.content.accept.click();

    //wait in the lesson space
    await s.page.setViewportSize({ width: 1600, height: 1200 });
    await s.page.reload();

    await s.page.waitForTimeout(1000);
    await t.page.waitForTimeout(1000);

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
