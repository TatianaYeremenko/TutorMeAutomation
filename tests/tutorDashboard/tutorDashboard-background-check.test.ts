it("Background Check is available fo tutotrs", async () => {

    //create tutor
    const {
        struct,
        page,
        user
    } = await createQaTutor();

    await page.waitForTimeout(1000);

    // click on Background Check
    await struct.tutorDashboard.header.checkr.waitForVisible();
    await struct.tutorDashboard.header.checkr.click();

    //check Privacy Policy link 
    const [pagePrivacyPolicy] = await Promise.all([
        page.waitForEvent('popup'),
        struct.tutorDashboard.checkr.privacyPolicy.click()
    ]);
    // Check url
    expect(pagePrivacyPolicy.url()).toContain('privacy-policy');

    //close page
    await pagePrivacyPolicy.close();

    // Check more Privacy Policy info
    const infoDetails = ['protectData', 'collectData', 'shareData'] as
    const;
    for (const link of infoDetails) {
        //check Privacy Policy link 
        const [pageMorePrivacyPolicy] = await Promise.all([
            page.waitForEvent('popup'),
            struct.tutorDashboard.checkr[link].click()
        ]);
        // Check url
        expect(pageMorePrivacyPolicy.url()).toContain('privacy-policy');

        //close page
        await pageMorePrivacyPolicy.close();
    }
    // check support link
    await struct.tutorDashboard.checkr.emailSupport.waitForVisible();
    expect(await struct.tutorDashboard.checkr.emailSupport.text()).toBe('support-testing@tutor.peardeck.com');

    // select Russia from the drop-down
    await struct.tutorDashboard.checkr.select.waitForVisible();
    await struct.tutorDashboard.checkr.select.click();
    await struct.tutorDashboard.checkr.select.type('Russia');
    await struct.tutorDashboard.checkr.select.press('ArrowDown');
    await struct.tutorDashboard.checkr.select.press('Enter');

    // click on Get Started
    await struct.tutorDashboard.checkr.start.waitForVisible();
    await struct.tutorDashboard.checkr.start.click();

    //tutor signs out
    await struct.tutorDashboard.header.userTools.openMenu.click();
    await struct.userMenu.signOut.click();

<<<<<<< HEAD
});
=======
});
>>>>>>> a495ae5 (update all)
