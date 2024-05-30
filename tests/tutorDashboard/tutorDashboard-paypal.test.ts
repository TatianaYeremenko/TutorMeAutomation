
it("Tutors can access to PayPal", async () => {
  
    //create tutor
    const {
        struct,
        page,
        user
    } = await createQaUser('tutor');
    
    // click on PayPal
    await struct.tutorDashboard.header.earnings.waitForVisible();
    await struct.tutorDashboard.header.earnings.click();
   
    // check url
    const [pagePayPal] = await Promise.all([
        page.waitForEvent('popup'),
        // await (await page.waitForSelector('//div[contains(text(),"Set up paypal")]')).click()
        await struct.tutorDashboard.header.paypal.click()
    ]);

    // Check url
    expect(pagePayPal.url()).toContain('sandbox.paypal');
    // console.log(pagePayPal.url())

    //close page
    await pagePayPal.close();

    await page.waitForTimeout(500);

    //tutor signs out
    await struct.tutorDashboard.header.userTools.openMenu.click();
    await struct.userMenu.signOut.click();

});
