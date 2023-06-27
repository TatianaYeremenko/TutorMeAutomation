describe('Footer - ', () => {
    it.each < {
            type: QaUserKind
        } > ([{
            type: "studentWithUmbrella"
        }])
        (
            '$type - all pages are redirecting to the correct webpages',
            async ({
                type
            }) => {
                const s = await createQaUser(type);


                    // GET TO KNOW US

                    // About Us
                    await s.struct.footer.about.click();
                    expect(s.page.url()).toContain('tutorme.com/company');
                    await s.page.goBack();

                    // Help Center

                    const [pageHelp] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer.help.click()
                    ]);
                    expect(pageHelp.url()).toContain('https://help.tutorme.com');
                    await pageHelp.close();

                    // Resource Hub
                    await s.struct.footer.blog.click();
                    expect(s.page.url()).toContain('tutorme.com/resources');
                    await s.page.goBack();

                    // Code of Conduct
                    await s.struct.footer.honorCode.click();
                    expect(s.page.url()).toContain('tutorme.com/policies/code-of-conduct');
                    await s.page.goBack();

                    // Accessibility
                    await s.struct.footer.accessibility.click();
                    expect(s.page.url()).toContain('tutorme.com/policies/accessibility');
                    await s.page.goBack();

                    // Careers
                    await s.struct.footer.careers.click();
                    expect(s.page.url()).toContain('tutorme.com/company');
                    await s.page.goBack();      

                    // Newsroom
                    await s.struct.footer.press.click();
                    expect(s.page.url()).toContain('tutorme.com/newsroom');
                    await s.page.goBack(); 

                    // LEARN WITH US

                    // Demo Lesson Space
                    await s.struct.footer.demoLessonSpace.click();
                    expect(s.page.url()).toContain('tutorme.dev/demo/whiteboard/');
                    await s.page.goBack();

                    // Browse Tutors
                    await s.struct.footer.browseTutors.click();
                    expect(s.page.url()).toContain('tutorme.dev/tutors/');
                    await s.page.goBack();

                    // PARTNER WITH US

                    // K-12 Schools
                    await s.struct.footer.k12Partners.click();
                    expect(s.page.url()).toContain('tutorme.com/k-12-schools-districts');
                    await s.page.goBack();                   

                    // Higher Ed
                    await s.struct.footer.academicPartners.click();
                    expect(s.page.url()).toContain('tutorme.com/college-universities');
                    await s.page.goBack();

    });
});