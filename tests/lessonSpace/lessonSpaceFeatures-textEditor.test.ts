import faker, { random } from "faker";

describe("live lesson - ", () => {
  it("student/tutor Lesson Tools: Text Editor is available and working for both", async () => {
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

    // Click on Text Editor
    await s.struct.lessonSpace.textEditorButton.click();

    // Click on Text
    for (const i of [12, 24]) {
      await s.struct.lessonSpace.textEditor.fontSize.selectBase.click();
      await s.struct.lessonSpace.textEditor.fontSize.item(i).click();
    }
    //Select color
    await s.struct.lessonSpace.textEditor.fontColor.selectBase.click();

    // Click on each
    const textEditButtons = [
      "bold",
      "italic",
      "underline",
      "strike",
      "highlight",
      "orderedList",
      "unorderedList",
      "todoList",
      "leftAlign",
      "centerAlign",
      "rightAlign",
      "indent",
      "unindent",
      "undo",
      "redo",
    ] as const;
    for (const item of textEditButtons) {
      await s.struct.lessonSpace.textEditor[item].click();
    }
    await s.struct.lessonSpace.textEditor.todoList.click();
    await s.struct.lessonSpace.textEditor.todoList.click();

    //check accessibility module
    await s.struct.lessonSpace.textEditor.accessibility.click();
    await s.struct.modals.textEditorAccessibility.waitForVisible();
    await s.struct.modals.textEditorAccessibility.content.close.click();

    //check LATEX
    await s.struct.lessonSpace.textEditor.latex.button.click();
    await s.struct.lessonSpace.textEditor.latex.textArea.type("2^2");
    await s.struct.lessonSpace.textEditor.latex.apply.click();
    expect(await s.struct.lessonSpace.textEditor.textArea.text()).toContain(
      "22Powered"
    );

    //click again and click on Help
    await s.struct.lessonSpace.textEditor.latex.button.click();
    const [pageHelp] = await Promise.all([
      s.page.waitForEvent("popup"),
      s.struct.lessonSpace.textEditor.latex.help.click(),
    ]);

    // Check url
    expect(pageHelp.url()).toBe(
      "https://help.tutor.peardeck.com/en/articles/984358-how-do-i-write-math-expressions-latex"
    );

    //close page
    await pageHelp.close();

    //tutor sees the same

    // Click on Text Editor
    await t.struct.lessonSpace.textEditorButton.click();

    for (const item of textEditButtons) {
      await t.struct.lessonSpace.textEditor[item].click();
    }
    await s.struct.lessonSpace.textEditor.todoList.click();
    await s.struct.lessonSpace.textEditor.todoList.click();

    expect(await t.struct.lessonSpace.textEditor.textArea.text()).toContain(
      "22Powered"
    );

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
