import faker, { random } from "faker";

it("student requests a lesson, checks a tutor profile and cancels the lesson", async () => {
  //create student
  const s = await createQaUser("studentWithUmbrella");
  const t = await createQaUser("tutor");


  //connect with a tutor
  await s.page.getByRole("link", { name: "Request a live tutor" }).click();
  await s.page
    .getByRole("heading", {
      name: "What subject area do you need help with?",
    })
    .isVisible();

  // select main categories
  // select grade
  // await s.page
  //   .locator("label")
  //   .filter({ hasText: "4th grade" })
  //   .click();
  // // await s.page.getByRole("button", { name: "Next" }).click();
  // await s.page.getByRole('button', { name: 'Next step' }).click();

  //select main categories
  await s.page
    .locator("label")
    .filter({ hasText: "Math" })
    .locator("svg")
    .first()
    .click();
  // await s.page.getByRole("button", { name: "Next" }).click();
  await s.page.getByRole('button', { name: 'Next step' }).click();

  //select main sub-categories
  await s.page
    .locator("label")
    .filter({ hasText: "Basic Math" })
    .locator("svg")
    .first()
    .click();

  // await s.page.getByRole("button", { name: "Next" }).click();
  await s.page.getByRole('button', { name: 'Next step' }).click();

  // go to the Next page
  // await s.page.getByRole("button", { name: "Next" }).click();
  await s.page.getByRole('button', { name: 'Next step' }).click();

  await s.page.waitForTimeout(2000);

  // move to the confirmation page
  await s.page.getByRole("button", { name: "Request a tutor" }).click();

  // cancel the request
  await t.page.waitForTimeout(1000);

  // tutor click on "live lesson
  await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
  await t.struct.tutorDashboard.header.pastTutoring.click();

  await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
  await t.struct.tutorDashboard.header.availableTutoring.click();
  await t.page.waitForTimeout(1000);

  // Claim session

  await t.page.waitForSelector('text="Claim session"');
  await t.page.click('text="Claim session"');

  // claim the lesson
  await t.struct.modals.claimLesson.content.claim.click();

  //tutor is in the waiting room
  await t.page.waitForTimeout(1000);

  //student is in the waiting room
  await s.page.waitForTimeout(1000);

  // student see the tutor name
  const tutorName = await s.struct.waitingRoom
    .tutor(t.user.id)
    .shortName.text();
  expect(tutorName).toBe(t.user.shortName);

  //and tutor's subjects header
  await s.struct.waitingRoom.tutor(t.user.id).subjects.waitForVisible();

  //student cancel the lesson
  await s.struct.waitingRoom.cancel.click();

  //student confirm canceling the lesson
  await s.struct.modals.waitingRoomCancel.waitForVisible();
  await s.struct.modals.waitingRoomCancel.content.cancel.click();

  // tutor receives the message
  await t.struct.modals.waitingRoomStudentCanceled.waitForVisible();
  await t.struct.modals.waitingRoomStudentCanceled.content.okay.click();

  // click on user menu
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});
