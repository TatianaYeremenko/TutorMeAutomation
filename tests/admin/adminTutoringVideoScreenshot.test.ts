

it("student requests a lesson directly, connects to a tutor and ends the lesson.", async () => {
    //create student
    const t = await createVisitor();

    // login
    await t.struct.authPages.signIn.email.waitForVisible();
    await t.struct.authPages.signIn.email.fill('tatiana.v.yeremenko@gmail.com');
  
    await t.struct.authPages.signIn.password.waitForVisible();
    await t.struct.authPages.signIn.password.fill('Ff22558800!');
    await t.page.waitForTimeout(500);
  
    await t.struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(t.struct.authPages.signIn.recaptcha);
  
    await Promise.all([
      t.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 40_000 }),
      t.struct.authPages.signIn.signIn.click(),
    ]);

      // click on past records
    await t.struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await t.struct.tutorDashboard.header.pastTutoring.click();
 
    await t.page.waitForTimeout(20000);
    await t.page.reload();

    //create student
    const s = await createVisitor();

    await s.page.waitForTimeout(1000);

    await s.struct.authPages.signIn.email.waitForVisible();
    await s.struct.authPages.signIn.email.fill('lisa.v.yeremenko@gmail.com');

    await s.struct.authPages.signIn.password.waitForVisible();
    await s.struct.authPages.signIn.password.fill('Ff22558800!');

    await s.page.waitForTimeout(1000);
    await s.struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(s.struct.authPages.signIn.recaptcha);
   
    await s.struct.authPages.signIn.signIn.waitForVisible();
    await s.struct.authPages.signIn.signIn.click();

    await s.page.waitForTimeout(1000);


    await s.page.keyboard.down("PageDown");
    await s.page.waitForTimeout(5000);


    // go to browse tutors
    await s.struct.footer.browseTutors.waitForVisible();
    await s.struct.footer.browseTutors.click();
    await s.page.keyboard.down("PageDown");
    await s.page.waitForTimeout(1000);
    await s.page.reload();
  
    // find available tutor
    // roster.favorite.contact(29737).name
    await s.struct.tutors.tutor(29737).name.waitForVisible();
    await s.struct.tutors.tutor(29737).name.click();
    await s.page.waitForTimeout(1000);
    await s.page.reload();
  
    //click on Start Lesson
    await s.struct.tutorProfile.requestLesson.waitForVisible();
    await s.page.waitForTimeout(1000);
    await s.page.reload();
    await s.struct.tutorProfile.requestLesson.click();
    // await (await s.page.waitForSelector('//div[@role="button" and contains(text(),"Start Lesson")]')).click();
  
    // select a subject form modal
    s.struct.modals.connectTutor.waitForVisible();
    s.struct.modals.connectTutor.content.subjectSelect.click();
    s.struct.modals.connectTutor.content.subjectSelect.press("ArrowDown");
    s.struct.modals.connectTutor.content.subjectSelect.press("Enter");
    s.struct.modals.connectTutor.content.sendRequest.waitForVisible();
    s.struct.modals.connectTutor.content.sendRequest.click();
  
    // modal pops up
    s.struct.modals.waitingForTutor.waitForVisible();
  
    // tutor accepts the request
    t.struct.modals.request.waitForVisible();
    t.struct.modals.request.content.accept.waitForVisible();
    t.struct.modals.request.content.accept.click();
  
    await t.page.waitForTimeout(1000);
    await s.page.waitForTimeout(1000);

    await t.page.waitForTimeout(1000);
    await s.page.waitForTimeout(1000);

    //end the lesson
    await s.struct.lessonSpace.header.end.waitForVisible();
    await s.struct.lessonSpace.header.end.click();
    await s.page.waitForTimeout(500);
  
    //confirm it
    await s.struct.modals.endLesson.content.end.waitForVisible();
    await s.struct.modals.endLesson.content.end.click();
    await s.page.waitForTimeout(500);
  
    //student return to the dashboard
    await s.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await s.struct.modals.somethingWentWrong.content.goToDashboard.click();
  
    // student signs out
    await s.struct.header.userTools.username.click();
    await s.struct.userMenu.signOut.click();
  
    //tutor return to the dashboard
    await t.struct.modals.somethingWentWrong.content.goToDashboard.waitForVisible();
    await t.struct.modals.somethingWentWrong.content.goToDashboard.click();
  

  });

  it('video and sreenshot are available', async () => {
    //create Admin
    const a = await createAdmin();
    await a.page.waitForTimeout(1000);
    await a.page.reload();
    await a.page.keyboard.down("PageDown");
  
    // click on Tutoring sessions
    await (
      await a.page.waitForSelector('//a[contains(text(),"Tutoring sessions")]')
    ).click();
    await a.page.waitForTimeout(1000);

    await (await a.page.waitForSelector('//input[@id="searchbar"]')).fill('tatiana.v.yeremenko');
    await (await a.page.waitForSelector('//input[@type="submit"]')).click();
    await a.page.waitForTimeout(2000);

  
    let tutors = await a.page.$$("//th/a");
    await tutors[0].click();
    await a.page.waitForTimeout(2000);
    // await a.page.keyboard.press('PageDown');


    //click on Take Screenshot
    await (
        await a.page.waitForSelector('//li[@data-tool-name="screenshot"]')
      ).click();
    await a.page.waitForTimeout(2000);
    await a.page.reload();
    await a.page.waitForTimeout(2000);
    await a.page.reload();

    const screenShot = await a.page.getAttribute('//div/img[@width]', 'src');
      console.log(screenShot);
      expect(screenShot).toContain('media/screenshots');

    // video link  
    // await a.page.waitForSelector('//div/video[@id="player"]');


    await a.page.close();
  });