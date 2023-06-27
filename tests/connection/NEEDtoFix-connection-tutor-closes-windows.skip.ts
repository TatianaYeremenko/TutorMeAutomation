import faker, {
  random
} from "faker";
import {product } from "../../lib/shared";  


describe("Lesson Connection: ", () => {
  it.each < {
    type: QaUserKind
} > ([{
    type: "studentWithBilling"
}, {
    type: "studentWithUmbrella"
}])(
    'when the tutor closes the lesson window for "$type", the student should see the Technical Difficulties module and be able to click on the End Lesson link',
    async ({
        type
    }) => {
        const s  = await createQaUser(type);

        // click on Search
        await s.struct.header.subjectsMenu.subjectsButton.waitForVisible();
        await s.struct.header.subjectsMenu.subjectsButton.click();
        
        // select subject
        await s.struct.header.subjectsMenu.category(1).click();
  
        //search for a subject
        await s.struct.tutors.subjectLink(1).click();
  
        //click on Match With Tutor
        await s.struct.tutors.autoMatchTop.waitForVisible();
        await s.struct.tutors.autoMatchTop.click();

      // fill out the form
      await s.struct.modals.requestLessonForm.waitForVisible();
      const text = `Lesson submitted from ${(product.toString()).toUpperCase()} ${faker.lorem.sentence(10).toString()}`;
      await s.struct.modals.requestLessonForm.content.description.fill(text);

      //upload files and submit request 
      await s.struct.modals.requestLessonForm.content.submit.click();
      await s.page.waitForTimeout(1000);
      
      //create tutor
      const t = await createQaUser('tutor');

      // tutor click on "live lesson
      // await t.struct.tutorDashboard.availableLesson(17437).claim.click()
      await t.page.waitForSelector('text="Past Tutoring"');
      await t.page.click('text="Past Tutoring"');

      await t.page.waitForSelector('text="Available Tutoring"');
      await t.page.click('text="Available Tutoring"');

      const liveButton = await t.page.waitForSelector('text="Live Lesson"');
      await liveButton.click();

      // claim the lesson
      await t.struct.modals.claimLesson.waitForVisible();
      await t.struct.modals.claimLesson.content.claim.click();

      //student enter the lesson  
      await s.struct.waitingRoom.enterLesson.waitForVisible();
      await s.struct.waitingRoom.enterLesson.click();
      await s.page.waitForTimeout(1000);

      //tutor confirm that a new student  
      await t.struct.modals.firstTime.waitForVisible();
      await t.struct.modals.firstTime.content.gotIt.waitForVisible();
      await t.struct.modals.firstTime.content.gotIt.click();
      await t.page.waitForTimeout(2000);

      //tutor closes the window
      await t.page.close();
      await s.page.waitForTimeout(2000);

      //Technical Difficulties module pops up 
      await s.struct.modals.awaitingOpponent.content.waitingForTutor.waitForVisible();
      expect(await s.struct.modals.awaitingOpponent.content.waitingForTutor.text()).toBe('Your tutor is experiencing technical difficulties');

      await s.struct.modals.awaitingOpponent.content.notBilled.waitForVisible();
      expect(await s.struct.modals.awaitingOpponent.content.notBilled.text()).toBe('You are not billed during this interruption');

      await s.struct.modals.awaitingOpponent.content.end.waitForVisible();
      await s.struct.modals.awaitingOpponent.content.end.click();

      //student return to the dashboard
      await s.struct.modals.somethingWentWrong.waitForVisible();
      await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
      await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

      // click on user menu
      await s.struct.header.userTools.username.click();
      await s.struct.userMenu.signOut.click();

  });
});