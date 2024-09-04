import faker, { random } from "faker";

it("student contacts a tutor directly, then cancel the request", async () => {
  //create tutor
  const t = await createQaUser("tutor");

  // get tutor name and id
  let tutorId = t.user.id.toString();
  let name = t.user.shortName.toString();

  //create student
  const s = await createQaUser("studentWithUmbrella");

  // go to browse tutors
  await s.struct.footer.browseTutors.waitForVisible();
  await s.struct.footer.browseTutors.click();
  await s.page.keyboard.down("PageDown");

  // find available tutor
  await s.struct.tutors.tutor(tutorId).name.waitForVisible();
  await s.struct.tutors.tutor(tutorId).card.click();

  //click on Start Lesson
  await s.struct.tutorProfile.requestLesson.waitForVisible();
  await s.struct.tutorProfile.requestLesson.click();

  // select a subject form modal
  await s.page.getByTestId("modals.connectTutor.content.subjectSelect").click();
  await s.page
    .getByTestId("modals.connectTutor.content.subjectSelect")
    .press("ArrowDown");
  await s.page
    .getByRole("listbox", { name: "Select a subject" })
    .press("ArrowDown");
  await s.page
    .getByRole("listbox", { name: "Select a subject" })
    .press("Enter");

  // await s.page.getByTestId('modals.connectTutor.content.option(10016).option').click();
  await s.page.getByRole("button", { name: "Send session request" }).click();

  // modal pops up
  s.struct.modals.waitingForTutor.waitForVisible();

  //modal pops up and student cancels lesson
  s.struct.modals.waitingForTutor.content.cancel.waitForVisible();
  s.struct.modals.waitingForTutor.content.cancel.click();

  await s.page.waitForTimeout(1000);
  await t.page.waitForTimeout(1000);

  //tutor see that the request was canceled
  t.struct.modals.waitingRoomStudentCanceled.waitForVisible();
  t.struct.modals.waitingRoomStudentCanceled.content.okay.click();

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});
