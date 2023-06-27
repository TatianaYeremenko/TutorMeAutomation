import faker, {
    random
  } from "faker";

    it("student requests a lesson directly, connects to a tutor and ends the lesson.", async () => {
  
        //create student
        const t = await createQaUser('tutor');
  
        // get tutor name and id
        let tutorId  = t.user.id.toString();
        let name = t.user.shortName.toString();

        //create student
        const s = await createQaUser('studentWithUmbrella');
        const studentId  = ''+  s.user.id.toString() + '';

  
        // go to browse tutors 
        await s.struct.footer.browseTutors.waitForVisible();
        await s.struct.footer.browseTutors.click();
        await s.page.keyboard.down('PageDown');
        await s.page.waitForTimeout(3000);

        // find available tutor
        await s.struct.tutors.tutor(tutorId).name.waitForVisible();
        await s.struct.tutors.tutor(tutorId).name.click();

        //click on Start Lesson
        await s.struct.tutorProfile.requestLesson.waitForVisible();
        await s.struct.tutorProfile.requestLesson.click();
        // await (await s.page.waitForSelector('//div[@role="button" and contains(text(),"Start Lesson")]')).click();

        // select a subject form modal
        s.struct.modals.connectTutor.waitForVisible();
        s.struct.modals.connectTutor.content.subjectSelect.click();
        s.struct.modals.connectTutor.content.subjectSelect.press('ArrowDown');
        s.struct.modals.connectTutor.content.subjectSelect.press('Enter');
        s.struct.modals.connectTutor.content.sendRequest.waitForVisible();
        s.struct.modals.connectTutor.content.sendRequest.click();

        // modal pops up 
        s.struct.modals.waitingForTutor.waitForVisible();

        // tutor accepts the request
        t.struct.modals.request.waitForVisible();
        t.struct.modals.request.content.accept.waitForVisible();
        t.struct.modals.request.content.accept.click();
        await s.page.waitForTimeout(1000);

        // check the name
        await s.struct.lessonSpace.header.username(studentId).waitForVisible();
        await s.page.waitForTimeout(1000);  

        //end the lesson
        await s.struct.lessonSpace.header.end.waitForVisible();
        await s.struct.lessonSpace.header.end.click();
        await s.page.waitForTimeout(1000);

        //confirm it
        await s.struct.modals.endLesson.content.end.waitForVisible();
        await s.struct.modals.endLesson.content.end.click();

        await s.page.waitForTimeout(1000);
  
        //student return to the dashboard
        await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
        await s.struct.modals.somethingWentWrong.content.goToDashboard.click();

        // student signs out
        await s.struct.header.userTools.username.click();
        await s.struct.userMenu.signOut.click();

        //tutor return to the dashboard
        await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
        await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
        
        //tutor signs out
        await t.struct.tutorDashboard.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();
  
    });
