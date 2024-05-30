import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: Calculator is available and working for both", async () => {
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

    // CHECK CALCULATER
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

    // CHECK CODE EDITOR

    //click on Code
    await s.struct.lessonSpace.codeEditorButton.click();

    // student check Code Editor
    await s.struct.lessonSpace.codeEditor.toolbar.addFile.click();

    //check the board
    await s.struct.lessonSpace.codeEditor.toolbar.newFileName.type("1");
    await s.struct.lessonSpace.codeEditor.toolbar.addNewFile.click();

    //error message
    expect(
      await s.struct.lessonSpace.codeEditor.toolbar.newFileNameError.text()
    ).toBe("File name must have an extension");

    // click add
    await s.struct.lessonSpace.codeEditor.toolbar.newFileName.type(".py");
    await s.struct.lessonSpace.codeEditor.toolbar.addNewFile.click();

    // click collapse
    await s.struct.lessonSpace.codeEditor.toolbar.collapse.click();

    // click expand
    await s.struct.lessonSpace.codeEditor.toolbar.expand.click();

    // export
    await s.struct.lessonSpace.codeEditor.toolbar.exportFiles.waitForVisible();

    //click on Code in tutor
    await t.struct.lessonSpace.codeEditorButton.click();

    // click on Code Editor
    await t.struct.lessonSpace.codeEditor.toolbar.addFile.click();

    //check the board
    await t.struct.lessonSpace.codeEditor.toolbar.newFileName.type("2");
    await t.struct.lessonSpace.codeEditor.toolbar.addNewFile.click();

    //error message
    expect(
      await t.struct.lessonSpace.codeEditor.toolbar.newFileNameError.text()
    ).toBe("File name must have an extension");

    // click add
    await t.struct.lessonSpace.codeEditor.toolbar.newFileName.type(".py");
    await t.struct.lessonSpace.codeEditor.toolbar.addNewFile.click();
    // click collapse
    await t.struct.lessonSpace.codeEditor.toolbar.collapse.click();
    // click expand
    await t.struct.lessonSpace.codeEditor.toolbar.expand.click();
    // export
    await t.struct.lessonSpace.codeEditor.toolbar.exportFiles.waitForVisible();

    //CHECK GOOGLE DOC

    // student click on Google Doc
    await s.struct.lessonSpace.google.click();

    // open Google Doc
    const [pageDoc] = await Promise.all([
      s.page.waitForEvent("popup"),
      s.struct.lessonSpace.googleDocs.docs.launch.click(),
    ]);
    // Check url
    expect(pageDoc.url()).toContain("docs.google.com/document");

    // open Google Spread Sheet
    const [pageSheet] = await Promise.all([
      s.page.waitForEvent("popup"),
      s.struct.lessonSpace.googleDocs.sheets.launch.click(),
    ]);
    // Check url
    expect(pageSheet.url()).toContain("docs.google.com/spreadsheets");

    // open Google Presentation
    const [pagePres] = await Promise.all([
      s.page.waitForEvent("popup"),
      s.struct.lessonSpace.googleDocs.slides.launch.click(),
    ]);
    // Check url
    expect(pagePres.url()).toContain("docs.google.com/presentation");

    // console.log(pageDoc.url());
    // console.log(pageSheet.url());
    // console.log(pagePres.url());

    pageDoc.close();
    pageSheet.close();
    pagePres.close();

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
