import faker, { random } from "faker";

it("tutor claim the lesson, check a student described problem and then cancels it", async () => {
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
  await s.page.waitForTimeout(1000);


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
  await t.struct.waitingRoom.headerTitle.waitForVisible();

  //student is in the waiting room
  await s.struct.waitingRoom.headerTitle.waitForVisible();

  await t.page.waitForTimeout(1000);

  //describe problem is visitable for a tutor
  // const describedStudentProblem = await t.page.locator('//div[@role="listitem"]').innerText();
  // expect(describedStudentProblem).toBe(describedStudentProblemText);

  // tutor cancels the lesson
  await t.struct.waitingRoom.cancel.click();

  // tutor cancellation survey

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

  // cancel without selecting the reason
  await t.struct.modals.waitingRoomUnassign.content.cancel.waitForVisible();
  await t.struct.modals.waitingRoomUnassign.content.cancel.click();

  // check the validation message
  await t.struct.modals.voidLesson.content.error.waitForVisible();
  expect(await t.struct.modals.voidLesson.content.error.text()).toBe(
    "You have to select something."
  );

  // select the reason
  for (let i = 0; i < 5; i++) {
    await t.struct.modals.waitingRoomUnassign.content
      .reason(i)
      .waitForVisible();
    await t.struct.modals.waitingRoomUnassign.content.reason(i).click();
  }

  // check Other reason but dont' explain the reason
  await t.struct.modals.waitingRoomUnassign.content.reason(6).click();
  await t.struct.modals.waitingRoomUnassign.content.comments.waitForVisible();

  // click cancel
  await t.struct.modals.waitingRoomUnassign.content.cancel.click();

  await t.struct.modals.waitingRoomUnassign.content.commentsError.waitForVisible();
  expect(
    await t.struct.modals.waitingRoomUnassign.content.commentsError.text()
  ).toBe("This field is required.");

  // type the reason
  const described = faker.lorem.sentence(3);
  await t.struct.modals.waitingRoomUnassign.content.comments.fill(described);

  // click cancel
  await t.struct.modals.waitingRoomUnassign.content.cancel.click();

  s.page.waitForTimeout(500);

  // student see the message
  await s.struct.modals.waitingRoomTutorUnassigned.waitForVisible();
  await s.struct.modals.waitingRoomTutorUnassigned.content.close.click();

  // student signs out
  await s.struct.header.userTools.username.click();
  await s.struct.userMenu.signOut.click();

  //tutor signs out
  await t.struct.tutorDashboard.header.userTools.username.click();
  await t.struct.userMenu.signOut.click();
  
});
