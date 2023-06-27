import faker, { random } from "faker";
import { readFileSync } from "fs";
import { max } from "lodash";
import { number } from "zod";

describe("live lesson - ", () => {
  it("student/tutor Void Survey is available ", async () => {
    const s = await createQaUser("studentWithUmbrella");

    await s.page.waitForSelector('text="Connect with a live tutor"');
    await s.page.click('text="Connect with a live tutor"');

    //search for a subject
    await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
    await s.struct.homepage.mainSubjectSearch.input.type("");
    await s.struct.homepage.mainSubjectSearch
      .items(faker.datatype.number(1))
      .click();
      await s.struct.homepage.mainSubjectSearch.input.press("ArrowDown");
      await s.struct.homepage.mainSubjectSearch.input.press("Enter");
      await s.struct.homepage.mainSubjectSearch.input.press("Enter");
      await s.page.waitForTimeout(2000);

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

    // tutor click on Pause
    await t.struct.lessonSpace.header.pause.click();

    // pop-ups appears
    await t.struct.modals.pauseLesson.waitForVisible();

    // click on Resume Lesson
    await t.struct.modals.pauseLesson.content.resume.click();

    // click on void
    await t.struct.lessonSpace.header.void.click();

    //tutor sees the void survey
    await t.struct.modals.voidLesson.waitForVisible();

    //check the message for tutors
    expect(await t.page.locator("id=modalDesc").textContent()).toBe(
      "Only void a lesson if you were unable to help the student, as you are not paid for voided lessons."
    );

    //return back to the lesson
    await t.struct.modals.voidLesson.content.returnToLesson.waitForVisible();
    await t.struct.modals.voidLesson.content.returnToLesson.click();

    // five reasons should be available
    await t.struct.lessonSpace.header.void.click();
    for (var reason = 0; reason < 5; reason++) {
      await t.struct.modals.voidLesson.content.reason(reason).click();
    }
    t.struct.modals.voidLesson.content.reason(faker.datatype.number(4)).click();

    // close the modal
    await t.struct.modals.voidLesson.content.void.click();
    await t.page.waitForTimeout(200);

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();

    //student sees the pop-up that the lesson was void and the student would not be charged
    await s.struct.modals.tutorVoided.waitForVisible();
    await s.struct.modals.tutorVoided.content.browseTutors.waitForVisible();
    await s.struct.modals.tutorVoided.content.browseTutors.waitForVisible();
    await s.struct.modals.tutorVoided.content.messageUs.waitForVisible();
    await s.struct.modals.tutorVoided.content.close.click();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();
  });
});
