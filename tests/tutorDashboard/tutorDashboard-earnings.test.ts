
  it("tutor can able to see the message : No earnings to report ", async () => {
  
    //create tutor
    const {
        struct,
        page,
        user
    } = await createQaUser('tutor');

    await page.waitForTimeout(1000);
    
    //update subjects
    await page.locator('//button[contains(text(),"Update my subjects")]').click();
    await page.waitForTimeout(500);

    await page.locator('label').filter({ hasText: 'Early MathSubjects include: Basic Math, Pre-Algebra, Algebra, Geometry' }).locator('svg').click();
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');

    await struct.account.subjects.save.click();
    await page.getByRole('link', { name: 'Go to my account' }).click();

    // click on Background Check
    await struct.tutorDashboard.header.earnings.waitForVisible();
    // expect(await struct.tutorDashboard.header.earnings.text()).toBe('Earnings');
    await struct.tutorDashboard.header.earnings.click();

    // check url
    expect(page.url()).toContain('/earnings/');

    // check the earning
    await (await page.waitForSelector('text="current week"')).textContent();
    await page.waitForSelector('text="all time"');


      //tutor signs out
      await struct.tutorDashboard.header.userTools.username.click();
      await struct.userMenu.signOut.click();
    
});

it("tutor can able to see the current week and total earnings", async () => {
  
    //create tutor
    const {
        struct,
        page
    } = await createVisitor();

    // sign in
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill('tatiana.v.yeremenko@gmail.com');
  
    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.fill('Ff22558800!');
    await page.waitForTimeout(500);
  
    await struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await struct.authPages.signIn.recaptcha.waitForVisible();

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();
    await page.waitForTimeout(3000);

    // //click on Cookies Banner     
    // const cookieBanner = await page.waitForSelector('//button[contains(text(),"Accept Cookies")]');
    // await cookieBanner.click();
   
    // check the earning
    await struct.tutorDashboard.header.earnings.waitForVisible();
    await struct.tutorDashboard.header.earnings.click();

    // check the earning
    await struct.tutorDashboard.earnings.currentWeekAmount.waitForVisible();
    await struct.tutorDashboard.earnings.cumulativeAmount.waitForVisible();
    await struct.tutorDashboard.earnings.info.waitForVisible();

    //tutor signs out
    await struct.tutorDashboard.header.userTools.username.click();
    await struct.userMenu.signOut.click();
     
});
