import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: Calculator is available and working for both", async () => {
    //connect with a tutor
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

    // await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
    // await s.struct.homepage.mainSubjectSearch.input.press('Enter');

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

    //student enter the lesson
    await s.struct.waitingRoom.enterLesson.waitForVisible();
    await s.struct.waitingRoom.enterLesson.click();
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    const new_student = await t.page.waitForSelector('text="Got it"');
    await new_student.click();

    // student check calculator
    await s.struct.lessonSpace.calculatorButton.click();

    // Enter 789 + 456 =
    const calculation = [
      "7",
      "8",
      "9",
      "Plus",
      "4",
      "5",
      "6",
      "Enter",
    ] as const;

    for (const item of calculation) {
      await s.page.click("[aria-label='" + item + "']");
    }
    // Click if tutor sees the result
    await t.struct.lessonSpace.calculatorButton.click();
    await t.page
      .locator('[aria-label="Expression 1: 789 plus 456 equals 1245"]')
      .isVisible();

    // tutor clear it up
    // await s.page.click('text=clear all');

    // Check again
    const tutorEquation = [
      "1",
      "1",
      "0",
      "Plus",
      "1",
      "2",
      "0",
      "Enter",
    ] as const;

    for (const item of tutorEquation) {
      await t.page.click("[aria-label='" + item + "']");
    }

    // Click if user sees the result
    await s.page
      .locator('[aria-label="Expression 2: 110 plus 120 equals 230"]')
      .isVisible();

    await s.page.click("text=clear all");
    await s.page.click('span:has-text("​")');

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
