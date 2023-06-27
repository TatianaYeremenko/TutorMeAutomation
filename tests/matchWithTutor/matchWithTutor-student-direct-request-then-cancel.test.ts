import faker, {
    random
  } from "faker";
  
    it("student contacts a tutor directly, then cancel the request", async () => {
  
        //create tutor
        const t = await createQaUser('tutor');

        // get tutor name and id
        let tutorId  = t.user.id.toString();
        let name = t.user.shortName.toString();

        //create student
        const s = await createQaUser('studentWithUmbrella');
  
        // go to browse tutors 
        await s.struct.footer.browseTutors.waitForVisible();
        await s.struct.footer.browseTutors.click();
        await s.page.keyboard.down('PageDown');

        // find available tutor
        await s.struct.tutors.filter.onlineNow.waitForVisible();
        await s.struct.tutors.filter.onlineNow.check();

        // click on the tutor  
        await s.struct.tutors.tutor(tutorId).viewProfile.waitForVisible();      
        await s.struct.tutors.tutor(tutorId).viewProfile.click();

        //click on Start Lesson
        await s.struct.tutorProfile.requestLesson.waitForVisible();
        await s.struct.tutorProfile.requestLesson.click();

        // select a subject form modal
        await s.struct.modals.connectTutor.waitForVisible();
        await s.struct.modals.connectTutor.content.subjectSelect.click();
        await s.struct.modals.connectTutor.content.subjectSelect.press('ArrowDown');
        await s.struct.modals.connectTutor.content.subjectSelect.press('Enter');
        await s.struct.modals.connectTutor.content.sendRequest.click();

        //modal pops up 
        await s.struct.modals.waitingForTutor.waitForVisible();
        await s.page.waitForTimeout(1000);

        //modal pops up and student cancels lesson
        s.struct.modals.waitingForTutor.content.cancel.waitForVisible();
        s.struct.modals.waitingForTutor.content.cancel.click();

        await s.page.waitForTimeout(1000);
        await t.page.waitForTimeout(1000);

        //tutor see that the request was canceled
        t.struct.modals.waitingRoomStudentCanceled.waitForVisible();
        t.struct.modals.waitingRoomStudentCanceled.content.okay.click();

        // student signs out
        await s.struct.header.userTools.username.click();
        await s.struct.userMenu.signOut.click();

        //tutor signs out
        await t.struct.tutorDashboard.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();
    });
