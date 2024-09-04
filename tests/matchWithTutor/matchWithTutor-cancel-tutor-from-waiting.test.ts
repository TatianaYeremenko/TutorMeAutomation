import faker, { random } from "faker";

it("tutor claim the lesson, check a student described problem and then cancels it", async () => {
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
  // await s.page.locator('label').filter({ hasText: '4th grade' }).isVisible();
  // await s.page.locator('label').filter({ hasText: '4th grade' }).click();
  // await s.struct.sessionRequest.nextArrow.click();

  //select main categories
  await s.page
    .locator("label")
    .filter({ hasText: "Math" })
    .locator("svg")
    .first()
    .click();
  // go to the Next page
  await s.struct.sessionRequest.nextArrow.click();


  //select main sub-categories
  await s.page
    .locator("label")
    .filter({ hasText: "Basic Math" })
    .locator("svg")
    .first()
    .click();

  // go to the Next page
  await s.struct.sessionRequest.nextArrow.click();

  // go to the Next page
  await s.struct.sessionRequest.nextArrow.click();
  await s.page.waitForTimeout(2000);

  // move to the confirmation page
  await s.page.getByRole("button", { name: "Request a tutor" }).click();

  // cancel the request

  // tutor click on "live lesson
  await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
  await t.struct.tutorDashboard.header.pastTutoring.click();

  await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
  await t.struct.tutorDashboard.header.availableTutoring.click();

  // Claim session
  await t.page.waitForSelector('text="Claim session"');
  await t.page.click('text="Claim session"');

  // claim the lesson
  await t.struct.modals.claimLesson.content.claim.waitForVisible();
  await t.struct.modals.claimLesson.content.claim.click();

  //tutor is in the waiting room
  await t.page.waitForTimeout(1000);

  //student is in the waiting room
  await s.page.waitForTimeout(1000);

  // tutor cancels the lesson
  await t.struct.waitingRoom.cancel.click();
  await t.page.waitForTimeout(1000);

  // tutor cancellation survey
  await t.page.locator('label').filter({ hasText: 'I don’t have the specific subject expertise to help the student.' }).locator('svg').click();
  await t.page.locator('label').filter({ hasText: 'The student’s request didn’t make sense.' }).locator('svg').click();
  await t.page.locator('label').filter({ hasText: 'The student left.' }).locator('svg').click();
  await t.page.locator('label').filter({ hasText: 'The student or I had technical difficulties.' }).locator('svg').click();

  // close the popup
  await t.struct.modals.waitingRoomUnassign.content.close.waitForVisible();
  await t.struct.modals.waitingRoomUnassign.content.close.click();

  // tutor cancels the lesson again
  await t.struct.waitingRoom.cancel.waitForVisible();
  await t.struct.waitingRoom.cancel.click();

  // click on Go Back
  await t.struct.modals.waitingRoomUnassign.content.goBack.waitForVisible();
  await t.struct.modals.waitingRoomUnassign.content.goBack.click();

  // select cancels again
  await t.struct.waitingRoom.cancel.waitForVisible();
  await t.struct.waitingRoom.cancel.click();

  // select the reason
  await t.page
    .locator("label")
    .filter({ hasText: "The student’s request didn’t make sense." })
    .locator("svg")
    .click();
  await t.page
    .locator("label")
    .filter({ hasText: "The student left." })
    .locator("svg")
    .click();
  await t.page
    .locator("label")
    .filter({ hasText: "The student or I had technical difficulties." })
    .locator("svg")
    .click();
  await t.page
    .locator("label")
    .filter({ hasText: "The student behaved inappropriately." })
    .locator("svg")
    .click();
  await t.page
    .locator("label")
    .filter({ hasText: "Other, please explain below." })
    .locator("svg")
    .click();
  await t.page.getByLabel("Additional comments").fill("test");
  await t.page
    .getByText("This field must be at least 10 characters.")
    .isVisible();
  await t.page.getByLabel("Additional comments").click();
  await t.page.getByLabel("Additional comments").fill("");
  await t.page
    .getByLabel("Additional comments")
    .fill("The student or I had technical difficulties.");

  // click cancel
  await t.struct.modals.waitingRoomUnassign.content.cancel.click();
  s.page.waitForTimeout(500);
  t.page.waitForTimeout(500);

  // student see the message
  // await s.struct.modals.waitingRoomTutorUnassigned.content.close
  await s.struct.modals.waitingRoomTutorUnassigned.content.close.click();

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});
