import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor whiteboard tools are available for both", async () => {
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

    // check check-box values
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

    // Student's side

    //check the board
    await s.struct.lessonSpace.whiteboard.board(0).waitForVisible();

    // add board
    await s.struct.lessonSpace.whiteboard.addBoard.click();
    // await s.struct.lessonSpace.opponentIcon.waitForVisible();

    await s.struct.lessonSpace.whiteboard.select.waitForVisible();
    await s.struct.lessonSpace.whiteboard.select.click();

    await s.struct.lessonSpace.whiteboard.move.waitForVisible();
    await s.struct.lessonSpace.whiteboard.move.click();

    await s.struct.lessonSpace.whiteboard.line.waitForVisible();
    await s.struct.lessonSpace.whiteboard.line.click();

    await s.struct.lessonSpace.whiteboard.rectangle.waitForVisible();
    await s.struct.lessonSpace.whiteboard.rectangle.click();

    await s.struct.lessonSpace.whiteboard.circle.waitForVisible();
    await s.struct.lessonSpace.whiteboard.circle.click();

    await s.page.waitForTimeout(200);

    // graph tools should show up

    // select stoke
    await s.struct.lessonSpace.whiteboard.stroke.selectBase.click();
    // Click on each
    const selectStokeItems = ["1", "2", "4", "8", "16", "SD", "SP"] as const;
    for (const item of selectStokeItems) {
      await s.struct.lessonSpace.whiteboard.stroke.item(item).click();
      await s.struct.lessonSpace.whiteboard.stroke.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();

    // Click on each
    const selectStokeColors = ["#1B2B34", "#CED2D9", "#AB7967"] as const;
    for (const item of selectStokeColors) {
      await s.struct.lessonSpace.whiteboard.strokeColor.item(item).click();
      await s.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.fillColor.selectBase.click();

    for (const item of selectStokeColors) {
      await s.struct.lessonSpace.whiteboard.fillColor.item(item).click();
      await s.struct.lessonSpace.whiteboard.fillColor.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.freehand.waitForVisible();
    await s.struct.lessonSpace.whiteboard.freehand.click();

    await s.struct.lessonSpace.whiteboard.textbox.waitForVisible();
    await s.struct.lessonSpace.whiteboard.textbox.click();

    //fontcolors should show up
    await s.struct.lessonSpace.whiteboard.fontColor.selectBase.click();

    for (const item of selectStokeColors) {
      await s.struct.lessonSpace.whiteboard.fontColor.item(item).click();
      await s.struct.lessonSpace.whiteboard.fontColor.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.font.selectBase.click();

    // Click on each
    const selectFonts = ["monospace", "sans-serif", "serif"] as const;

    for (const item of selectFonts) {
      await s.struct.lessonSpace.whiteboard.font.item(item).click();
      await s.struct.lessonSpace.whiteboard.font.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.fontSize.selectBase.click();

    // Click on each
    const selectSizes = [
      "9",
      "10",
      "11",
      "12",
      "14",
      "16",
      "24",
      "30",
      "36",
      "48",
      "60",
      "72",
      "96",
    ] as const;

    for (const item of selectSizes) {
      await s.struct.lessonSpace.whiteboard.fontSize.item(item).click();
      await s.struct.lessonSpace.whiteboard.fontSize.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.math.waitForVisible();
    await s.struct.lessonSpace.whiteboard.math.click();

    await s.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();

    // Click on each

    for (const item of selectStokeColors) {
      await s.struct.lessonSpace.whiteboard.strokeColor.item(item).click();
      await s.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();
    }

    await s.struct.lessonSpace.whiteboard.graph.waitForVisible();
    await s.struct.lessonSpace.whiteboard.graph.click();

    await s.struct.lessonSpace.whiteboard.strokeColor.selectBase.waitForHidden();
    await s.struct.lessonSpace.whiteboard.font.selectBase.waitForHidden();
    await s.struct.lessonSpace.whiteboard.fontSize.selectBase.waitForHidden();

    await s.struct.lessonSpace.whiteboard.shorcuts.waitForVisible();
    await s.struct.lessonSpace.whiteboard.shorcuts.click();
    await s.struct.modals.shortcuts.content.close.click();

    await s.struct.lessonSpace.whiteboard.grid.selectBase.waitForVisible();

    await s.page.waitForTimeout(100);

    // Click on each
    const selectBaseItems = ["GRID_OFF", "GRID_8", "GRID_16"] as const;
    for (const item of selectBaseItems) {
      await s.struct.lessonSpace.whiteboard.grid.selectBase.click();
      await s.struct.lessonSpace.whiteboard.grid.item(item).click();
    }

    // Tutor's side

    // check the session plan
    await t.struct.lessonSpace.sessionPlanButton.waitForVisible();
    await t.struct.lessonSpace.sessionPlanButton.click();

    await t.struct.lessonSpace.sessionPlan.raiseGoals('raiseRapport').waitForVisible();
    await t.struct.lessonSpace.sessionPlan.raiseGoals('raiseRapport').click();

    // add board
    await t.struct.lessonSpace.whiteboardButton.waitForVisible();
    await t.struct.lessonSpace.whiteboardButton.click();

    await t.struct.lessonSpace.whiteboard.addBoard.click();
    // await s.struct.lessonSpace.whiteboardButton.waitForVisible();

    await t.struct.lessonSpace.whiteboard.select.waitForVisible();
    await t.struct.lessonSpace.whiteboard.select.click();

    await t.struct.lessonSpace.whiteboard.move.waitForVisible();
    await t.struct.lessonSpace.whiteboard.move.click();

    await t.struct.lessonSpace.whiteboard.line.waitForVisible();
    await t.struct.lessonSpace.whiteboard.line.click();

    await t.struct.lessonSpace.whiteboard.rectangle.waitForVisible();
    await t.struct.lessonSpace.whiteboard.rectangle.click();

    await t.struct.lessonSpace.whiteboard.circle.waitForVisible();
    await t.struct.lessonSpace.whiteboard.circle.click();

    await t.page.waitForTimeout(200);

    // graph tools should show up

    // select stoke
    await t.struct.lessonSpace.whiteboard.stroke.selectBase.click();

    // Click on each
    for (const item of selectStokeItems) {
      await t.struct.lessonSpace.whiteboard.stroke.item(item).click();
      await t.struct.lessonSpace.whiteboard.stroke.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();

    // Click on each
    for (const item of selectStokeColors) {
      await t.struct.lessonSpace.whiteboard.strokeColor.item(item).click();
      await t.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.fillColor.selectBase.click();

    for (const item of selectStokeColors) {
      await t.struct.lessonSpace.whiteboard.fillColor.item(item).click();
      await t.struct.lessonSpace.whiteboard.fillColor.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.freehand.waitForVisible();
    await t.struct.lessonSpace.whiteboard.freehand.click();

    await t.struct.lessonSpace.whiteboard.textbox.waitForVisible();
    await t.struct.lessonSpace.whiteboard.textbox.click();

    //fontcolors should show up
    await t.struct.lessonSpace.whiteboard.fontColor.selectBase.click();

    for (const item of selectStokeColors) {
      await t.struct.lessonSpace.whiteboard.fontColor.item(item).click();
      await t.struct.lessonSpace.whiteboard.fontColor.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.font.selectBase.click();

    // Click on each
    for (const item of selectFonts) {
      await t.struct.lessonSpace.whiteboard.font.item(item).click();
      await t.struct.lessonSpace.whiteboard.font.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.fontSize.selectBase.click();

    // Click on each
    for (const item of selectSizes) {
      await t.struct.lessonSpace.whiteboard.fontSize.item(item).click();
      await t.struct.lessonSpace.whiteboard.fontSize.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.math.waitForVisible();
    await t.struct.lessonSpace.whiteboard.math.click();

    await t.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();

    // Click on each

    for (const item of selectStokeColors) {
      await t.struct.lessonSpace.whiteboard.strokeColor.item(item).click();
      await t.struct.lessonSpace.whiteboard.strokeColor.selectBase.click();
    }

    await t.struct.lessonSpace.whiteboard.graph.waitForVisible();
    await t.struct.lessonSpace.whiteboard.graph.click();

    await t.struct.lessonSpace.whiteboard.strokeColor.selectBase.waitForHidden();
    await t.struct.lessonSpace.whiteboard.font.selectBase.waitForHidden();
    await t.struct.lessonSpace.whiteboard.fontSize.selectBase.waitForHidden();

    await t.struct.lessonSpace.whiteboard.shorcuts.waitForVisible();
    await t.struct.lessonSpace.whiteboard.shorcuts.click();
    await t.struct.modals.shortcuts.content.close.click();

    await t.struct.lessonSpace.whiteboard.grid.selectBase.waitForVisible();

    await t.page.waitForTimeout(100);

    // Click on each
    for (const item of selectBaseItems) {
      await t.struct.lessonSpace.whiteboard.grid.selectBase.click();
      await t.struct.lessonSpace.whiteboard.grid.item(item).click();
    }

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
