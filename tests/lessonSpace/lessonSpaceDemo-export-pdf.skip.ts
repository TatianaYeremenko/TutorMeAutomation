import faker, {
    random
  } from "faker";

  interface TutorsConnection {
    userType: string;
  }
  class PublicRequest {
    userType: string;
  
    constructor(userType: string) {
      this.userType = userType;
    }
  }
  const conection: TutorsConnection = new PublicRequest("studentWithUmbrella");
  console.log(conection.userType);
  
  describe("live lesson - ", () => {
    it("student/tutor Lesson Tools: Export of the lesson chat is available and working", async () => {
  
        const s = await createQaUser('studentWithUmbrella');
  
        //connect with a tutor
        await s.struct.homepage.connectWithTutor.waitForVisible();
        await s.struct.homepage.connectWithTutor.click();
  
        //search for a subject
        await s.struct.homepage.mainSubjectSearch.search.waitForVisible();
        await s.struct.homepage.mainSubjectSearch.input.click();
        await s.struct.homepage.mainSubjectSearch.items(1).click();
        await s.struct.homepage.mainSubjectSearch.input.press('Enter');

        await s.page.waitForTimeout(500);

  
        // fill out the Describe Problem form with a few words
        await s.struct.modals.requestLessonForm.waitForVisible();
        const describedStudentProblemText = faker.lorem.sentence(15);
        await s.struct.modals.requestLessonForm.content.description.type(describedStudentProblemText);
  
        //submit request 
        await s.struct.modals.requestLessonForm.content.submit.click();
  
        // create a tutor
        const t = await createQaUser('tutor');
  
        // tutor click on "live lesson
        await t.struct.tutorDashboard.header.pastTutoring.click();
        // await t.page.waitForSelector('text="Past Tutoring"');
        // await t.page.click('text="Past Tutoring"');

        await t.struct.tutorDashboard.header.availableTutoring.click();
        // await t.page.waitForSelector('text="Available Tutoring"');
        // await t.page.click('text="Available Tutoring"');

        const liveButton = await t.page.waitForSelector('text="Live Lesson"');
        await liveButton.click();
  
        // claim the lesson
        await t.struct.modals.claimLesson.waitForVisible();
        await t.struct.modals.claimLesson.content.claim.click();
  
        //student enter the lesson  
        await s.struct.waitingRoom.enterLesson.waitForVisible();
        await s.struct.waitingRoom.enterLesson.click();
  
        //tutor confirm that a new student  
        await t.struct.modals.firstTime.content.gotIt.waitForVisible();
        await t.struct.modals.firstTime.content.gotIt.click();
  
        // tutor click on Chat Export
        await t.struct.lessonSpace.chat.header.export.waitForVisible();
        await t.struct.lessonSpace.chat.header.export.click();

        // await t.page.locator('//div[@role="button" and contains(text(),"Export")]').click();
        // await t.page.waitForTimeout(1000);
        // console.log(await s.struct.lessonSpace.header.mode.text());
          
        // student click on Chat Export
        await s.struct.lessonSpace.chat.header.export.waitForVisible();
        await s.struct.lessonSpace.chat.header.export.click();

        // await s.page.locator('//div[@role="button" and contains(text(),"Export")]').click();
        // await s.page.waitForTimeout(1000);

        //end the lesson
        await s.struct.lessonSpace.header.end.click();
        await s.struct.modals.endLesson.content.end.click();
        await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

        // click on user menu
        await s.struct.header.userTools.username.click();
        await s.struct.userMenu.signOut.click();

        //tutor return to the dashboard
        await t.struct.modals.somethingWentWrong.content.goToDashboard.click();

        //sign out
        await t.struct.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();


  
    });
  });
  









