import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: Video and Audio Fullscreen functionalities are available", async () => {
    //create tutor
    const t = await createQaUser("tutor");

    // get tutor name and id
    let tutorId = t.user.id.toString();
    let name = t.user.shortName.toString();

    //select subject
    // click on Edit Profile
    await t.struct.tutorDashboard.header.userTools.username.waitForVisible();
    await t.struct.tutorDashboard.header.userTools.username.click();

    await t.struct.userMenu.editProfile.waitForVisible();
    await t.struct.userMenu.editProfile.click();

    await t.page.waitForTimeout(500);

    //check Curriculum Area
    await t.page.getByRole("link", { name: "Subjects and Skills" }).click();
    // await t.page.getByRole("link", { name: "Subjects and Skills" }).click();

    await t.page.keyboard.press("ArrowDown");
    await t.page.keyboard.press("PageDown");


    let checked = await (await t.page.waitForSelector('//div[contains(text(),"Early Math")]')).isChecked();
    if (checked == false ) { 
      await (
        await t.page.waitForSelector('//div[contains(text(),"Early Math")]')
      ).click();
    }

    // submit the changes
    await t.struct.account.subjects.save.click();
    await t.page.waitForTimeout(2000);
    await t.page.reload();


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

    // select a subject form modal
    await s.struct.modals.connectTutor.content.subjectSelect.click();
    await s.struct.modals.connectTutor.content.option(10004).option.click();
    await s.page.keyboard.press("Enter");

    await s.page
      .getByRole("combobox", { name: "Select your grade level*" })
      .click();
    await s.page.getByRole("option", { name: "1st grade" }).click();

    //Describe your question
    await s.struct.sessionRequest.description.type("test");

    // close button is avalable
    await s.struct.modals.connectTutor.content.close.waitForVisible();

    // Code of Conduct
    await s.struct.sessionRequest.codeOfConduct.check();

    // await s.page.getByTestId('modals.connectTutor.content.option(10016).option').click();
    await s.page.getByRole("button", { name: "Send session request" }).click();

    // modal pops up
    await s.struct.modals.waitingForTutor.waitForVisible();

    // tutor accepts the request
    await t.struct.modals.request.waitForVisible();
    await t.struct.modals.request.content.accept.waitForVisible();
    await t.struct.modals.request.content.accept.click();
    await t.page.waitForTimeout(1000);
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    t.struct.modals.firstTime.content.gotIt.waitForVisible();
    t.struct.modals.firstTime.content.gotIt.click();

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
    await t.struct.lessonSpace.header.end.waitForHidden();
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();

    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.cancel.waitForVisible();
    await s.struct.modals.endLesson.content.close.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();

    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.content.browseTutors.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.browseTutors.click();
    await s.page.waitForTimeout(2000);

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
