import faker, {
    random
  } from "faker";
  import {product } from "../../lib/shared";  
  
  
  describe("Lesson Connection: ", () => {
    it('When a student closes the lesson window, a tutor should see the Technical Difficulties module, but when the student re-enrolls, the message has disappeared',
      async () => {
        const s  = await createVisitor();
  
        // sign in
        await s.struct.header.signIn.click();
        await s.struct.modals.signIn.waitForVisible();
 
        await s.struct.modals.signIn.content.email.fill('tutorme.testing.now@gmail.com');
 
        await s.struct.modals.signIn.content.password.waitForVisible();
        await s.struct.modals.signIn.content.password.fill('Tt22558800!');
 
        await s.page.waitForTimeout(2000);
        await fillRecaptcha(s.struct.modals.signIn.content.recaptcha);
    
        await s.struct.modals.signIn.content.signIn.waitForVisible();
        await Promise.all([
            s.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
            s.struct.modals.signIn.content.signIn.click(),
          ]);

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

        const liveButton = await t.page.waitForSelector('text="Claim Session"');
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

        const a  = await createVisitor();

        // sign in again
        await a.struct.header.signIn.click();
        await a.struct.modals.signIn.waitForVisible();
 
        await a.struct.modals.signIn.content.email.fill('tutorme.testing.now@gmail.com');
 
        await a.struct.modals.signIn.content.password.waitForVisible();
        await a.struct.modals.signIn.content.password.fill('Tt22558800!');
 
        await a.page.waitForTimeout(1000);
        await fillRecaptcha(a.struct.modals.signIn.content.recaptcha);
    
        await a.struct.modals.signIn.content.signIn.waitForVisible();
        await a.struct.modals.signIn.content.signIn.click();

        await a.page.waitForTimeout(5000);
        
         //end the lesson
         await a.struct.lessonSpace.header.end.waitForVisible();
         await a.struct.lessonSpace.header.end.click();
 
         await a.page.waitForTimeout(200);
 
         //confirm it
         await a.struct.modals.endLesson.content.end.waitForVisible();
         await a.struct.modals.endLesson.content.end.click();
 
         await a.page.waitForTimeout(200);
   
         //student return to the dashboard
         await a.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
         await a.struct.modals.somethingWentWrong.content.goToDashboard.click();
 
         // student signs out
         await a.struct.header.userTools.username.click();
         await a.struct.userMenu.signOut.click();
 
         //tutor return to the dashboard
         await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
         await t.struct.modals.somethingWentWrong.content.goToDashboard.click();

         //tutor signs out
        await t.struct.tutorDashboard.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();
  
  
    });
  });