import faker, { random } from "faker";

it("student requests a lesson, checks a tutor profile and cancels the lesson", async () => {
  //create student
  const s = await createQaUser("studentWithUmbrella");

  //connect with a tutor
  await s.page.waitForSelector('text="Connect with a live tutor"');
  await s.page.click('text="Connect with a live tutor"');

  //search for a subject
  await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
  await s.struct.homepage.mainSubjectSearch.input.type("");
  await s.struct.homepage.mainSubjectSearch
    .items(faker.datatype.number(5))
    .click();
  await s.struct.homepage.mainSubjectSearch.input.press("ArrowDown");
  await s.struct.homepage.mainSubjectSearch.input.press("Enter");
  await s.struct.homepage.mainSubjectSearch.input.press("Enter");
  await s.page.waitForTimeout(500);
  await s.page.waitForLoadState();


  // await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
  // await s.struct.homepage.mainSubjectSearch.input.press('Enter');

  // fill out the form
  // await s.struct.modals.requestLessonForm.waitForVisible();
  // const text = faker.lorem.sentence(15);
  const text = `Lesson Submitted From ${process.env.PLAYWRIGHT_PRODUCT?.toString().toUpperCase()} ${faker.lorem
    .sentence(10)
    .toString()}`;
  await s.struct.modals.requestLessonForm.content.description.fill(text);

  //upload files and submit request
  const examplesFile = [
    "./lib/files/example_1.gif",
    "./lib/files/example_3.gif",
    "./lib/files/example_3.gif",
  ];
  await s.struct.modals.requestLessonForm.waitForVisible();
  await s.struct.modals.requestLessonForm.content.addFiles.selectFiles(
    examplesFile[0]
  );
  await s.struct.modals.requestLessonForm.content.submit.click();

  // cancel the request
  await s.struct.modals.notifyingTutors.waitForVisible();
  await s.struct.modals.notifyingTutors.content.cancel.click();

  const t = await createQaUser("tutor");

  await t.page.waitForTimeout(1000);

  // confirm the cancellation and then keep searching
  await s.struct.modals.confirmCancel.waitForVisible();
  await s.struct.modals.confirmCancel.content.keepSearching.click();

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
