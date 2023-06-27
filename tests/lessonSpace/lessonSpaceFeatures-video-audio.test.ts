import faker, { random } from "faker";


describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: Video and Audio Fullscreen functionalities are available", async () => {
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
    await s.struct.modals.requestLessonForm.waitForVisible();
    await s.struct.modals.requestLessonForm.content.addFiles.selectFiles(
      "./lib/files/example_3.gif"
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

    // tutor turn audio and video on
    await t.struct.lessonSpace.video.toggleAudio.waitForVisible();
    console.log(await t.struct.lessonSpace.video.toggleAudio.text());
    expect(await t.struct.lessonSpace.video.toggleAudio.text()).toBe(
      "Turn Audio On"
    );
    await t.struct.lessonSpace.video.toggleAudio.click();

    // tutor turn video on/off
    await t.struct.lessonSpace.video.toggleVideo.waitForVisible();
    console.log(await t.struct.lessonSpace.video.toggleVideo.text());
    expect(await t.struct.lessonSpace.video.toggleVideo.text()).toBe(
      "Turn Video On"
    );
    await t.struct.lessonSpace.video.toggleVideo.click();

    // tutor turn fullSreen on/off
    await t.struct.lessonSpace.video.toggleFullscreen.waitForVisible();
    expect(await t.struct.lessonSpace.video.toggleFullscreen.text()).toBe(
      "Enter Full Screen (Video)"
    );
    await t.struct.lessonSpace.video.toggleFullscreen.click();
    await t.struct.lessonSpace.video.flipCamera.waitForVisible();
    await t.struct.lessonSpace.video.toggleFullscreen.click();

    // student turn audio and video on
    await s.struct.lessonSpace.video.toggleAudio.waitForVisible();
    console.log(await s.struct.lessonSpace.video.toggleAudio.text());
    expect(await s.struct.lessonSpace.video.toggleAudio.text()).toBe(
      "Turn Audio On"
    );
    await s.struct.lessonSpace.video.toggleAudio.click();

    // student turn video on/off
    await s.struct.lessonSpace.video.toggleVideo.waitForVisible();
    console.log(await s.struct.lessonSpace.video.toggleVideo.text());
    expect(await s.struct.lessonSpace.video.toggleVideo.text()).toBe(
      "Turn Video On"
    );
    await s.struct.lessonSpace.video.toggleVideo.click();

    // student turn fullSreen on/off
    await s.struct.lessonSpace.video.toggleFullscreen.waitForVisible();
    console.log(await s.struct.lessonSpace.video.toggleFullscreen.text());
    expect(await s.struct.lessonSpace.video.toggleFullscreen.text()).toBe(
      "Enter Full Screen (Video)"
    );
    await s.struct.lessonSpace.video.toggleFullscreen.click();
    await s.struct.lessonSpace.video.flipCamera.waitForVisible();
    await s.struct.lessonSpace.video.toggleFullscreen.click();

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
