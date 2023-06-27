import faker from "faker";

describe("cancellation penalty", () => {
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
});
