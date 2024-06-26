import faker, {
  random
} from "faker";

describe("live lesson - ", () => {
  it("umbrella student signs in, requests a lesson, connects to a tutor, ends and signs out", async () => {

      const s = await createQaUser('studentWithUmbrella');

      //connect with a tutor
      await s.page.waitForSelector('text="Connect with a live tutor"');
      await s.page.click('text="Connect with a live tutor"');
      
      //search for a subject
      await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
      await s.struct.homepage.mainSubjectSearch.input.type('');
      await s.struct.homepage.mainSubjectSearch.items(faker.datatype.number(5)).click();
      await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
      await s.struct.homepage.mainSubjectSearch.input.press('Enter');
      await s.struct.homepage.mainSubjectSearch.input.press('Enter');
      await s.page.waitForTimeout(500);
      await s.page.waitForLoadState();



      // await s.struct.homepage.mainSubjectSearch.input.press('ArrowDown');
      // await s.struct.homepage.mainSubjectSearch.input.press('Enter');

      // fill out the form
      // await s.struct.modals.requestLessonForm.waitForVisible();
      // const text = faker.lorem.sentence(15);
      const text = `Lesson Submitted From ${(process.env.PLAYWRIGHT_PRODUCT?.toString().toUpperCase())} ${faker.lorem.sentence(10).toString()}`;
      await s.struct.modals.requestLessonForm.content.description.fill(text);

      //upload files and submit request 
      const examplesFile = ['./lib/files/example_1.gif', './lib/files/example_3.gif', './lib/files/example_3.gif']
      // await s.struct.modals.requestLessonForm.waitForVisible();
      await s.struct.modals.requestLessonForm.content.addFiles.selectFiles(examplesFile[0]);
      await s.struct.modals.requestLessonForm.content.submit.click();

      // cancel the request
      await s.struct.modals.notifyingTutors.waitForVisible();
      await s.struct.modals.notifyingTutors.content.cancel.click();

      const t = await createQaUser('tutor');

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

      //end the lesson
      await s.struct.lessonSpace.header.end.waitForVisible();
      await s.struct.lessonSpace.header.end.click();

      await s.struct.modals.endLesson.content.end.waitForVisible();
      await s.struct.modals.endLesson.content.end.click();
      await s.page.waitForTimeout(1000);


      //student return to the dashboard
      // await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
      await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

      // click on user menu
      await s.struct.header.userTools.username.click();
      await s.struct.userMenu.signOut.click(); 

      //tutor return to the dashboard
      // await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
      await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
      
      //tutor signs out
      await t.struct.tutorDashboard.header.userTools.username.click();
      await t.struct.userMenu.signOut.click();
  
  });
});