import faker, {
    random
  } from "faker";
  import {product } from "../../lib/shared";  
  
  
  describe("Lesson Connection: ", () => {
    it.each < {
      type: QaUserKind
  } > ([{
      type: "studentWithUmbrella"
  }])(
      'when "$type" student closes the lesson window, a tutor should see the Technical Difficulties module and be able to click on End Lesson link',
      async ({
          type
      }) => {
          const s  = await createQaUser(type);
  
        //connect with a tutor
  
        // click on Search
        await s.struct.header.subjectsMenu.subjectsButton.waitForVisible();
        await s.struct.header.subjectsMenu.subjectsButton.click();
        
        // select subject
        await s.struct.header.subjectsMenu.category(6).click();
  
        //search for a subject
        await s.struct.tutors.subjectLink(faker.datatype.number({min: 145, max: 150})).click();
  
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
  
        await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.pastTutoring.click();

        await t.struct.tutorDashboard.header.availableTutoring.waitForVisible();
        await t.struct.tutorDashboard.header.availableTutoring.click();

        const liveButton = await t.page.waitForSelector('text="Claim session"');
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
  
        //student closes the window
        await s.page.close();
        await t.page.waitForTimeout(2000);
  
        //Technical Difficulties module pops up 
        await t.struct.modals.awaitingOpponent.waitForVisible();
        expect(await t.struct.modals.awaitingOpponent.text()).toBe('Please wait...Your student is experiencing technical difficultiesVoid LessonEnd Lesson');
  
        await t.struct.modals.awaitingOpponent.content.end.waitForVisible();
        await t.struct.modals.awaitingOpponent.content.end.click();
  
        //tutor return to the dashboard
        await t.struct.modals.somethingWentWrong.waitForVisible();
        await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
        await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
  
        // click on user menu
        await t.struct.tutorDashboard.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();
  
    });

  });