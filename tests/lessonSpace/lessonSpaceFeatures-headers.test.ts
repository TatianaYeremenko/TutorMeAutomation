import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Space header", async () => {
    const s = await createQaUser("studentWithUmbrella");

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
      await s.page.waitForTimeout(2000);

    // fill out the form
    await s.struct.modals.requestLessonForm.waitForVisible();
    // const text = faker.lorem.sentence(15);
    const text = `Lesson Submitted From ${process.env.PLAYWRIGHT_PRODUCT?.toString().toUpperCase()} ${faker.lorem
      .sentence(10)
      .toString()}`;
    await s.struct.modals.requestLessonForm.content.description.fill(text);

    //upload files and submit request
    const examplesFile = [
      "./lib/files/example_1.gif",
      "./lib/files/example_2.gif",
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
    await s.page.waitForTimeout(100);


    //student enter the lesson
    await s.struct.waitingRoom.enterLesson.waitForVisible();
    await s.struct.waitingRoom.enterLesson.click();
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    const new_student = await t.page.waitForSelector('text="Got it"');
    await new_student.click();

    await t.page.waitForTimeout(500);

    // student header check
    const studentHeaderButtons = [
      "logo",
      "timerToggle",
      "end",
      "help",
    ] as const;
    for (const item of studentHeaderButtons) {
      await s.struct.lessonSpace.header[item].waitForVisible();
    }

    // click on Timer
    await s.struct.lessonSpace.header.timerToggle.click();
    await s.struct.lessonSpace.header.timerDisplay.waitForVisible();

    //check the timer
    function timeValidation(strTime: string) {
      var timeFormat = /^\d?\d:\d{2}:\d{2}$/;
      return timeFormat.test(strTime);
    }
    timeValidation(await s.struct.lessonSpace.header.timerDisplay.text());
    console.log(await s.struct.lessonSpace.header.timerDisplay.text());

    //after 10 seconds
    await s.page.waitForTimeout(3000);

    // expect(await s.struct.lessonSpace.header.timerDisplay.text()).toContain('00:00:05');
    console.log(await t.struct.lessonSpace.header.timerDisplay.text());
    expect(await t.struct.lessonSpace.header.timerDisplay.text()).toContain('00:00:04');

    //click on end lesson and then cancel it
    await s.struct.lessonSpace.header.end.click();
    await s.struct.modals.endLesson.waitForVisible();
    await s.struct.modals.endLesson.content.cancel.click();
    await s.struct.lessonSpace.header.end.waitForVisible();

    //click on help lesson and then close it
    await s.struct.lessonSpace.header.help.waitForVisible();
    await s.struct.lessonSpace.header.help.click();
    await s.struct.lessonSpace.header.help.click();

    await s.struct.lessonSpace.header.username(s.user.id).waitForVisible();
    expect(await s.struct.lessonSpace.header.mode.text()).toBe("(Student)");

    // tutor header check
    const tutorHeaderButtons = [
      "logo",
      "timerToggle",
      "end",
      "void",
      "pause",
      "help",
    ] as const;
    for (const item of tutorHeaderButtons) {
      await t.struct.lessonSpace.header[item].waitForVisible();
    }

    // click on Timer on Tutor Side
    await t.struct.lessonSpace.header.timerToggle.click();
    await t.struct.lessonSpace.header.timerDisplay.waitForVisible();

    //check the timer
    timeValidation(await t.struct.lessonSpace.header.timerDisplay.text());

    //click on pause and then cancel it
    await t.struct.lessonSpace.header.pause.click();
    await t.struct.modals.pauseLesson.waitForVisible();
    await t.struct.modals.pauseLesson.content.resume.click();
    await t.struct.lessonSpace.header.pause.waitForVisible();

    //click on help lesson and then close it
    await t.struct.lessonSpace.header.help.waitForVisible();
    await t.struct.lessonSpace.header.help.click();

    await t.struct.lessonSpace.header.help.click();

    await t.struct.lessonSpace.header.username(t.user.id).waitForVisible();
    expect(await t.struct.lessonSpace.header.mode.text()).toBe("(Tutor)");

    await s.page.waitForTimeout(1000);

    //end the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.cancel.waitForVisible();
    await s.struct.modals.endLesson.content.close.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.messageUs.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();

    //tutor return to the dashboard
    await t.struct.modals.somethingWentWrong.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.messageUs.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.click();

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();
  });
});
