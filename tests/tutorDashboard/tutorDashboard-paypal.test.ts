
    it("Tutors can access to PayPal", async () => {
  
        //create tutor
        const {
            struct,
            page,
            user
        } = await createQaUser('tutor');
            
        //update subjects
        
        await page.locator('//button[contains(text(),"Update my subjects")]').click();
        await page.waitForTimeout(500);

        await page.locator('label').filter({ hasText: 'Early MathSubjects include: Basic Math, Pre-Algebra, Algebra, Geometry' }).locator('svg').click();
        await page.keyboard.press('PageDown');
        await page.keyboard.press('PageDown');

        await struct.account.subjects.save.click();
        await page.getByRole('link', { name: 'Go to my account' }).click();

        
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
        await struct.tutorDashboard.header.userTools.username.click();
        await struct.userMenu.signOut.click();
  
    });
