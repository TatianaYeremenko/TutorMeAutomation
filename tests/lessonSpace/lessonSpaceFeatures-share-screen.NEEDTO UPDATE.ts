import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: ScreenSaring functionalities are available", async () => {
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
    await s.page.waitForTimeout(3000);

    // find available tutor
    await s.struct.tutors.tutor(tutorId).name.waitForVisible();
    await s.struct.tutors.tutor(tutorId).card.click();

    //click on Start Lesson
    await s.struct.tutorProfile.requestLesson.waitForVisible();
    await s.struct.tutorProfile.requestLesson.click();

    await s.page
      .getByRole("heading", { name: "Request a session with Sol" })
      .isVisible();
    await s.page
      .getByText(
        "Please remember that it's not allowed to ask for help on a test or quiz. Student"
      )
      .isVisible();
    const [CodeConduct] = await Promise.all([
      s.page.waitForEvent("popup"),
      s.page
        .getByTestId("modals.connectTutor")
        .getByRole("link", { name: "Code of Conduct" })
        .click(),
    ]);
    CodeConduct.close();

    // select a subject form modal
    await s.page
      .getByTestId("modals.connectTutor.content.subjectSelect")
      .click();
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
    t.struct.modals.request.content.accept.waitForVisible();
    t.struct.modals.request.content.accept.click();
    await s.page.waitForTimeout(1000);

    // check the name
    await s.struct.lessonSpace.header.username(studentId).waitForVisible();
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    t.struct.modals.firstTime.content.gotIt.waitForVisible();
    t.struct.modals.firstTime.content.gotIt.click();

    // const new_student = await t.page.waitForSelector('text="Got it"');
    // await new_student.click();

    // student click on share screen
    await t.struct.lessonSpace.video.toggleFullscreen.click();
    await s.page.waitForTimeout(1000);

    // student click on share screen
    await s.struct.lessonSpace.screenShareSwitch.click(); // Click triggers a popup.

    //end the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.cancel.waitForVisible();
    await s.struct.modals.endLesson.content.close.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

    // click on user menu
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();

    //tutor return to the dashboard
    await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
    await t.page.waitForTimeout(1000);        

    //tutor signs out
    await t.struct.tutorDashboard.header.userTools.username.click();
    await t.struct.userMenu.signOut.click();
  });
});
