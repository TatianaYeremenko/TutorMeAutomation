describe('Umbrella Home Page - ', () => {
    it('"Connect with a live tutor" and "Writing Lab: Get Writing Help" buttons are present and working', async () => {
        const {
            page,
            struct
        } = await createQaUser('studentWithUmbrella');

       // the header
       expect(await (await page.waitForSelector('h1')).innerText()).toBe('On-demand online tutoring');

        // Connect with a live tutor 
        await struct.homepage.connectWithTutor.waitForVisible();
        await struct.homepage.connectWithTutor.click();
        await struct.homepage.goBack.click();

        // Writing Lab: Get Writing Help 
        await struct.homepage.writingLab.waitForVisible();
        await struct.homepage.writingLab.click();

        //Modal pops up
        await (await page.waitForSelector('//div[@role="button" and contains(text(),"I Understand")]')).click();

        //close it
        await (await page.waitForSelector('//div[@aria-label="Close dialog"]')).click();
        
        // student signs out
        await struct.header.userTools.username.click();
        await struct.userMenu.signOut.click();

    });

});
