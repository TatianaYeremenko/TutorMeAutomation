import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor whiteboard tools are available for both", async () => {
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

    //student enter the lesson
    await s.struct.waitingRoom.enterLesson.waitForVisible();
    await s.struct.waitingRoom.enterLesson.click();
    await s.page.waitForTimeout(1000);

    //tutor confirm that a new student
    const new_student = await t.page.waitForSelector('text="Got it"');
    await new_student.click();

    // student check whiteboard
    await s.struct.lessonSpace.whiteboardButton.click();

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

    //check the board
    await t.struct.lessonSpace.whiteboard.board(0).waitForVisible();

    // add board
    await t.struct.lessonSpace.whiteboard.addBoard.click();
    // await s.struct.lessonSpace.opponentIcon.waitForVisible();

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
