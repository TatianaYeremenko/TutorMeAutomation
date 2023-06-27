import faker, { random } from "faker";

it("student is able to search a tutor and send a message", async () => {
  //create student
  const t = await createQaUser("tutor");

  // get tutor name and id
  const tutorId = "" + t.user.id.toString() + "";

  //create student
  const s = await createQaUser("studentWithUmbrella");

  // go to browse tutors
  await s.struct.footer.browseTutors.waitForVisible();
  await s.struct.footer.browseTutors.click();
  await s.page.keyboard.down("PageDown");

  // check filter online available tutors
  await s.struct.tutors.filter.onlineNow.waitForVisible();
  await s.struct.tutors.filter.onlineNow.check();

  // check filter online available tutors
  await s.struct.tutors.filter.onlineNow.waitForVisible();
  await s.struct.tutors.filter.onlineNow.check();

  // find available tutor
  await s.struct.tutors.tutor(tutorId).name.waitForVisible();
  await s.struct.tutors.tutor(tutorId).name.click();

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

  expect(
    await t.struct.header.notifications.chat
      .contact(s.user.id.toString())
      .text.text()
  ).toBe(
    "Hello, I would like to schedule a lesson, please let me when you are available"
  );

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});
