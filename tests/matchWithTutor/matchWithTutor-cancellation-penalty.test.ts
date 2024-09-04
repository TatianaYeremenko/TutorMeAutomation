import faker from "faker";

describe("cancellation penalty", () => {
<<<<<<< HEAD
    it("student cancels request, the cancellation message displays", async () => {
        //estimated time 73 s
        jest.setTimeout(950000);

        //open student account
        const s = await createQaUser("studentWithUmbrella");

        // check the student short 
        expect(await s.struct.header.userTools.username.text()).toBe(s.user.shortName);

        //request a lesson
        await s.struct.homepage.connectWithTutor.waitForVisible();
        await s.struct.homepage.connectWithTutor.click();

        //search for a subject
        await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
        await s.struct.homepage.mainSubjectSearch.search.click();
        await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
        await s.struct.homepage.mainSubjectSearch.input.press('Enter');
        await s.page.waitForTimeout(1500);
        await s.page.waitForLoadState();

        // fill out the form
        // await s.struct.modals.requestLessonForm.waitForVisible();
        await s.struct.modals.requestLessonForm.content.description.type(faker.lorem.sentence(15));

        //upload files
        const fileExamples = ['./lib/files/example_1.gif', './lib/files/example_3.gif', './lib/files/example_3.gif']

        await s.struct.modals.requestLessonForm.waitForVisible()
        await s.struct.modals.requestLessonForm.content.addFiles.selectFiles(fileExamples[0]);
        await s.struct.modals.requestLessonForm.content.submit.click();

        // cancel the request
        await s.struct.modals.notifyingTutors.waitForVisible();
        await s.struct.modals.notifyingTutors.content.cancel.click();

        // confirm the cancellation
        await s.struct.modals.confirmCancel.waitForVisible();
        await s.struct.modals.confirmCancel.content.cancel.click();

        //search for a subject again
        await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
        await s.struct.homepage.mainSubjectSearch.search.click();
        await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
        await s.struct.homepage.mainSubjectSearch.input.press('Enter');

        // penalty request message
        await s.struct.modals.requestPenalty.waitForVisible();

        // wait 10 sec
        await s.page.waitForTimeout(10000);

        // click on "OK, got it"
        await s.struct.modals.requestPenalty.content.okGotIt.click();

        //go back to search
        await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
        await s.struct.homepage.mainSubjectSearch.search.click();

        // request penalty message still displays
        await s.struct.modals.requestPenalty.waitForVisible();

        // wait 20 sec
        await s.page.waitForTimeout(20000);

        // fill out the form
        // await s.struct.modals.requestLessonForm.waitForVisible();
        await s.struct.modals.requestLessonForm.content.description.type(faker.lorem.sentence(15));

        //submit request 
        await s.struct.modals.requestLessonForm.content.submit.click();

        // cancel the request
        await s.struct.modals.notifyingTutors.waitForVisible();
        await s.struct.modals.notifyingTutors.content.cancel.click();

        await s.page.waitForTimeout(1000);

        // confirm the cancellation
        await s.struct.modals.confirmCancel.waitForVisible();
        await s.struct.modals.confirmCancel.content.cancel.click();

        await s.page.waitForTimeout(1000);

        // student signs out
        await s.struct.header.userTools.username.click();
        await s.struct.userMenu.signOut.click();



    });
=======
  it("student cancels request, the cancellation message displays", async () => {
    //estimated time 73 s
    jest.setTimeout(950000);

    //open student account
    const { struct, page } = await createQaUser("studentWithUmbrella");

    //connect with a tutor
    await page.getByRole("link", { name: "Request a live tutor" }).click();
    await page
      .getByRole("heading", {
        name: "What subject area do you need help with?",
      })
      .click();

    //select main categories
    await page
      .locator("label")
      .filter({ hasText: "Math" })
      .locator("svg")
      .first()
      .click();
    // go to the Next page
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);

    //select main sub-categories
    await page
      .locator("label")
      .filter({ hasText: "Basic Math" })
      .locator("svg")
      .click();
      await struct.sessionRequest.nextArrow.click();

    // go to the Next page
    await struct.sessionRequest.nextArrow.click();
    await page.waitForTimeout(2000);

    // move to the confermation page
    await page.getByRole("button", { name: "Request a tutor" }).click();

    // move to the waiting page
    await page
      .getByRole("heading", { name: "Finding you a tutor..." })
      .isVisible();
    await page
      .getByText(
        "Are you ready for your session? Please find a quiet place and prepare to share y"
      )
      .isVisible();

    //cancell the request
    await struct.modals.notifyingTutors.content.cancel.click();

    // confirm cancelling
    await struct.modals.confirmCancel.content.cancel.waitForVisible();
    await struct.modals.confirmCancel.content.cancel.click();

    // request public request again
    await page.getByRole("link", { name: "Request a live tutor" }).click();

    await struct.modals.requestPenalty.waitForVisible();
    await struct.modals.requestPenalty.content.close.click();

    // click on request again
    await page.getByRole("link", { name: "Request a live tutor" }).click();

    // wait 10 sec
    await page.waitForTimeout(10000);

    // click on "OK, got it"
    await struct.modals.requestPenalty.content.okGotIt.click();

    // click on request again
    await page.getByRole("link", { name: "Request a live tutor" }).click();
    // request penalty message still displays
    await struct.modals.requestPenalty.waitForVisible();

    // wait 20 sec
    await page.waitForTimeout(21000);

    // click on request again
    await page.getByRole("link", { name: "Request a live tutor" }).click();

    // request form opens
    await page
      .getByRole("heading", {
        name: "What subject area do you need help with?",
      })
      .isVisible();
    // close the page
    // await page.getByRole("link", { name: "Close dialog" }).click();
    await struct.sessionRequest.close.click();

    // go back to home page
    await page
      .getByRole("heading", { name: "What can a tutor help you with today?" })
      .isVisible();

    // student signs out
    await struct.header.userTools.openMenu.click();
    await struct.userMenu.signOut.click();
  });
>>>>>>> a495ae5 (update all)
});
