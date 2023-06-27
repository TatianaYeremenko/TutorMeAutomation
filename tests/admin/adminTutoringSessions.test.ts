import faker, { random } from "faker";

it("student requests a lesson directly, connects to a tutor and ends the lesson.", async () => {
  //create student
  const t = await createQaUser("tutor");

  // get tutor name and id
  let tutorId = t.user.id.toString();
  let name = t.user.shortName.toString();

  //create student
  const s = await createQaUser("studentWithUmbrella");
  const studentId = "" + s.user.id.toString() + "";

  // go to browse tutors
  await s.struct.footer.browseTutors.waitForVisible();
  await s.struct.footer.browseTutors.click();
  await s.page.keyboard.down("PageDown");
  await s.page.waitForTimeout(2000);

  // find available tutor
  await s.struct.tutors.tutor(tutorId).name.waitForVisible();
  await s.struct.tutors.tutor(tutorId).name.click();

  //click on Start Lesson
  await s.struct.tutorProfile.requestLesson.waitForVisible();
  await s.struct.tutorProfile.requestLesson.click();
  // await (await s.page.waitForSelector('//div[@role="button" and contains(text(),"Start Lesson")]')).click();

  // select a subject form modal
  s.struct.modals.connectTutor.waitForVisible();
  s.struct.modals.connectTutor.content.subjectSelect.click();
  s.struct.modals.connectTutor.content.subjectSelect.press("ArrowDown");
  s.struct.modals.connectTutor.content.subjectSelect.press("Enter");
  s.struct.modals.connectTutor.content.sendRequest.waitForVisible();
  s.struct.modals.connectTutor.content.sendRequest.click();

  // modal pops up
  s.struct.modals.waitingForTutor.waitForVisible();

  // tutor accepts the request
  t.struct.modals.request.waitForVisible();
  t.struct.modals.request.content.accept.waitForVisible();
  t.struct.modals.request.content.accept.click();

  await s.page.waitForTimeout(2000);
  // check the name
  await s.struct.lessonSpace.header.username(studentId).waitForVisible();
  await s.page.waitForTimeout(5000);

  //end the lesson
  await s.struct.lessonSpace.header.end.waitForVisible();
  await s.struct.lessonSpace.header.end.click();

  await s.page.waitForTimeout(1000);

  //confirm it
  await s.struct.modals.endLesson.content.end.waitForVisible();
  await s.struct.modals.endLesson.content.end.click();

  await s.page.waitForTimeout(1000);

  //student return to the dashboard
  await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
  await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor return to the dashboard
  await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
  await t.struct.modals.somethingWentWrong.content.goToDashboard.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
});

it('“Mark as Fraud","View","Take Screenshot","Moderation Approve","Moderation Reject", "History" tabs are visible and working', async () => {
  //create Admin
  const a = await createAdmin();
  // console.log(await a.page.url());
  // console.log(await (await a.page.waitForSelector('//div[@id="user-tools"]')).innerText());
  await a.page.waitForTimeout(2000);
  await a.page.keyboard.down("PageDown");

  // click on Tutoring sessions
  await (
    await a.page.waitForSelector('//a[contains(text(),"Tutoring sessions")]')
  ).click();
  await a.page.waitForTimeout(1000);

  let tutors = await a.page.$$("//th/a");
  await tutors[0].click();
  await a.page.isVisible('//a[contains(text(),"Mark as Fraud")]');
  await a.page.isVisible('//a[contains(text(),"View")]');
  await a.page.isVisible('//a[contains(text(),"Take Screenshot")]');
  await a.page.isVisible('//a[contains(text(),"Moderation Approve")]');
  await a.page.isVisible('//a[contains(text(),"Moderation Reject")]');
  await a.page.isVisible('//a[contains(text(),"History")]');

  // click on "History"
  await (await a.page.waitForSelector('//a[contains(text(),"History")]')).click();
  await a.page.waitForTimeout(5000);
//   console.log(a.page.url());
  expect(a.page.url()).toContain('history');

  await a.page.goBack();

  // click on Moderation
  await (
    await a.page.waitForSelector('//a[contains(text(),"Moderation Approve")]')
  ).click();
  await a.page.waitForTimeout(500);
  await a.page.isHidden('//a[contains(text(),"Moderation Approve")]');
  await a.page.isVisible('//li[contains(text(),"Lesson approved")]');

  // click on Reject
  await (
    await a.page.waitForSelector('//a[contains(text(),"Moderation Reject")]')
  ).click();
  await a.page.waitForTimeout(500);
  await a.page.isHidden('//a[contains(text(),"Moderation Reject")]');
  await a.page.isVisible('//li[contains(text(),"Lesson reject")]');
  await a.page.waitForTimeout(1000);


  // click on "Mark as Fraud"
  await a.page.waitForSelector('//a[contains(text(),"Mark as Fraud")]')
  await a.page.waitForTimeout(500);

  const MarkFraud = await a.page.getAttribute('//option[contains(text(),"Yes")]', 'value');
//   console.log(MarkFraud);
  expect(MarkFraud).toBe('true');

  await a.page.close();
});
