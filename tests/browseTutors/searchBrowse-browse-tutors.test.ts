import faker, { random } from "faker";

it("student is able to search a tutor and send a message", async () => {
  //create student and tutor
  const t = await createQaUser("tutor");
  const s = await createQaUser("studentWithUmbrella");

  // get tutor name and id
  const tutorId = "" + t.user.id.toString() + "";
  // console.log(tutorId);

  //refresh the page
  await s.page.waitForTimeout(3000);
  await t.page.waitForTimeout(3000);

  await (await t.page.waitForSelector('//button[contains(text(),"Review your subjects")]')).click();
  await t.page.waitForTimeout(100);
  await t.page.getByRole("button", { name: "Save selections" }).click();
  await t.page.waitForTimeout(100);
  await (await t.page.waitForSelector('//a[contains(text(),"Go to your account")]')).click();
 

  // go to browse tutors
  await s.page.goto('https://stg-tutor.peardeck.com/tutors/');
  await s.page.reload();
  await t.page.reload();

  // find available tutor
  await s.struct.tutors.tutor(tutorId).name.waitForVisible();
  await s.struct.tutors.tutor(tutorId).card.click();

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
