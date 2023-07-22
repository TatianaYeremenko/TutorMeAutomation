it("part tutor should not able to see earnings section", async () => {

    //ttps://tutorme247.atlassian.net/browse/TM-2093
  
    //create tutor
    const {
        struct,
        page
    } = await createVisitor();       

    // sign in
    await struct.authPages.signIn.email.waitForVisible();
    await struct.authPages.signIn.email.fill('part_time_tutor@local.tutorme.com');
  
    await struct.authPages.signIn.password.waitForVisible();
    await struct.authPages.signIn.password.fill('Tutor12345!');
    await page.waitForTimeout(500);
  
    await struct.authPages.signIn.recaptcha.waitForVisible();
    await fillRecaptcha(struct.authPages.signIn.recaptcha);
    await struct.authPages.signIn.recaptcha.waitForVisible();

    await struct.authPages.signIn.signIn.waitForVisible();
    await struct.authPages.signIn.signIn.click();
    await page.waitForTimeout(500);


    await page.setViewportSize({
        width: 1024,
        height: 768,
      });

    await page.waitForTimeout(2000);
    await page.keyboard.press('PageDown');  


    // check if the earning is not visible
    await struct.tutorDashboard.header.earnings.waitForHidden();

    // check if the Background Check and HeatMap is not visible
    await struct.tutorDashboard.header.checkr.waitForHidden();
    await struct.tutorDashboard.header.heatmap.waitForHidden();

        
    // check if the everything elase is avalble
    await struct.tutorDashboard.header.availableTutoring.waitForVisible();
    await struct.tutorDashboard.header.resources.waitForVisible();
    await struct.tutorDashboard.header.pastTutoring.waitForVisible();
    await page.waitForTimeout(500);


    //tutor signs out
    await page.close();

});
