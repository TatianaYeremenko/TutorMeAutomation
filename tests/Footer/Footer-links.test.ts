describe('Footer - ', () => {
    it.each < {
            type: QaUserKind
        } > ([{
            type: "student"
        },{
            type: "studentWithUmbrella"
        }])
        (
            '$type - all pages are redirecting to the correct webpages',
            async ({
                type
            }) => {
                const s = await createQaUser(type);

                    // Browse Tutors
                    await s.struct.footer.browseTutors.click();
                    expect(await s.page.title()).toContain('Pear Deck Tutor');
                    // expect(await s.page.title()).toBe('On-demand one-on-one tutoring for schools and districts | Pear Deck Tutor');

                    expect(s.page.url()).toContain('tutors');
                    await s.page.goBack();                    

                    // Demo Lesson Space
                    await s.struct.footer.demoLessonSpace.click();
                    expect(await s.page.title()).toContain('Pear Deck Tutor');
                    // expect(await s.page.title()).toBe('On-demand one-on-one tutoring for schools and districts | Pear Deck Tutor');

                    expect(s.page.url()).toContain('demo/whiteboard/');
                    await s.page.goBack();

                    // Help Center
                    const [pageHelp] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.help.click()
                    ]);
                    expect(pageHelp.url()).toContain('help.tutor.peardeck.com');
                    await pageHelp.close();

                    //TutorMe Logo
                    await s.struct.footer.logo.click();
                    //move to the home page
                    s.struct.homepage.requestATutor.waitForVisible();

                    // console.log(await s.page.title());
                    await s.page.goBack();                    

                    // GoGuardian page link
                    const [pageGG] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.company.click()
                    ]);
                    expect(pageGG.url()).toContain('https://www.goguardian.com/');
                    await pageGG.close();

                    // Code of Conduct
                    const [pageHonorCode] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.honorCode.click()
                    ]);
                    expect(pageHonorCode.url()).toContain('pear-deck-tutor-code-of-conduct');
                    await pageHonorCode.close();             
                
                    // Product Terms of Service
                    const [pageTerms] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.terms.click()
                    ]);
                    expect(pageTerms.url()).toContain('peardeck.com/policies/product-terms-and-end-user-license-agreement');
                    await pageTerms.close();

                    // Product Privacy Policy
                    const [pagePolicy] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.privacyPolicy.click()
                    ]);

                    expect(pagePolicy.url()).toContain('peardeck.com/policies/privacy-policy-for-product-users');
                    await pagePolicy.close();

 
                    // student signs out
                    await s.struct.header.userTools.openMenu.click();
                    await s.struct.userMenu.signOut.click();

    });
});