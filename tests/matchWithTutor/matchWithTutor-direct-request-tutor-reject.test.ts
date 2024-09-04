import faker, { random } from "faker";

it("student requests a lesson directly but tutor rejects it", async () => {
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
<<<<<<< HEAD
  await s.struct.tutors.tutor(tutorId).name.click();
=======
  await s.struct.tutors.tutor(tutorId).card.click();
>>>>>>> a495ae5 (update all)

  //click on Start Lesson
  await s.struct.tutorProfile.requestLesson.waitForVisible();
  await s.struct.tutorProfile.requestLesson.click();

  // select a subject form modal
<<<<<<< HEAD
  await s.struct.modals.connectTutor.waitForVisible();
  await s.struct.modals.connectTutor.content.subjectSelect.click();
  await s.struct.modals.connectTutor.content.subjectSelect.press("ArrowDown");
  await s.struct.modals.connectTutor.content.subjectSelect.press("Enter");
  await s.struct.modals.connectTutor.content.sendRequest.click();
  await s.page.waitForTimeout(500);
  await s.page.waitForLoadState();

  //modal pops up
  await s.struct.modals.waitingForTutor.waitForVisible();
  await s.page.waitForTimeout(1000);

  //tutor rejects request
  await t.struct.modals.request.waitForVisible();
  await t.struct.modals.request.content.reject.click();
  await t.page.waitForTimeout(1000);

=======
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

  // tutor accepts the request
  t.struct.modals.request.waitForVisible();
  t.struct.modals.request.content.reject.waitForVisible();
  t.struct.modals.request.content.reject.click();
  await s.page.waitForTimeout(1000);

>>>>>>> a495ae5 (update all)
  //student see the tutor's rejection
  await s.struct.modals.requestRejected.content.okay.waitForVisible();
  await s.struct.modals.requestRejected.content.okay.click();

  await s.struct.tutorProfile.contact.waitForVisible();
  await s.struct.tutorProfile.contact.click();

  //student is sending message
  const chatBox = s.page.locator("#chatMessageInput");
  await chatBox.type(
    "Hello, I would like to schedule a lesson, please let me when you are available",
    { delay: 100 }
  );
  await chatBox.press("Enter");

  // tutor see the message
  await t.struct.tutorDashboard.header.notifications.chat.amount.waitForVisible();
  expect(
    await t.struct.tutorDashboard.header.notifications.chat.amount.text()
  ).toBe("1");

  await t.struct.tutorDashboard.header.notifications.chat.button.waitForVisible();
  await t.struct.tutorDashboard.header.notifications.chat.button.click();
<<<<<<< HEAD

  expect(await t.struct.header.notifications.chat.contact(s.user.id.toString()).text.text()).toBe('Hello, I would like to schedule a lesson, please let me when you are available');
=======
  await t.page.waitForTimeout(10000);

  expect(
    await t.struct.header.notifications.chat
      .contact(s.user.id.toString())
      .text.text()
  ).toBe(
    "Hello, I would like to schedule a lesson, please let me when you are available"
  );
>>>>>>> a495ae5 (update all)

  // student sign out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
<<<<<<< HEAD

=======
>>>>>>> a495ae5 (update all)
});
