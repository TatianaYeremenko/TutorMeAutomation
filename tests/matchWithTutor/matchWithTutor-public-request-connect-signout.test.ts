import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("umbrella student signs in, requests a lesson, connects to a tutor, ends and signs out", async () => {
    const s = await createQaUser("studentWithUmbrella");

    //connect with a tutor
    await s.page.getByRole("link", { name: "Request a live tutor" }).click();
    await s.page
      .getByRole("heading", {
        name: "What subject area do you need help with?",
      })
      .isVisible();

    //select main categories
    await s.page
      .locator("label")
      .filter({ hasText: "Math" })
      .locator("svg")
      .first()
      .click();
      await s.struct.sessionRequest.nextArrow.click();

    //select main sub-categories
    await s.page
      .locator("label")
      .filter({ hasText: "Basic Math" })
      .locator("svg")
      .first()
      .click();

      await s.struct.sessionRequest.nextArrow.click();

    // fill out the Describe Problem form with a few words
    await s.struct.sessionRequest.description.fill(faker.lorem.sentence(5));

    await s.struct.sessionRequest.uploadFile.input.click();
    await s.struct.sessionRequest.uploadFile.input.selectFiles("./lib/files/example_1.gif");
    await s.page.waitForTimeout(2000);

    // go to the Next page
    await s.struct.sessionRequest.nextArrow.click();
    await s.page.waitForTimeout(2000);

    // move to the confirmation page
    await s.page.getByRole("button", { name: "Request a tutor" }).click();

    const t = await createQaUser("tutor");

    await t.page.waitForTimeout(1000);

    // tutor click on "live lesson
    await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await t.struct.tutorDashboard.header.pastTutoring.click();

    await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await t.struct.tutorDashboard.header.availableTutoring.click();

    await t.page.waitForSelector('text="Claim session"');
    await t.page.click('text="Claim session"');

    // claim the lesson
    await t.struct.modals.claimLesson.content.claim.waitForVisible();
    await t.struct.modals.claimLesson.content.claim.click();

    //student enter the lesson
    await s.struct.waitingRoom.enterLesson.waitForVisible();
    await s.struct.waitingRoom.enterLesson.click();
    await s.page.waitForTimeout(2000);

    //tutor confirm that a new student
    const new_student = await t.page.waitForSelector('text="Got it"');
    await new_student.click();

    //end the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();
    await s.page.waitForTimeout(1000);

    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

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
