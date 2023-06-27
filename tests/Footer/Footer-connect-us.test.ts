describe('Visitor/Regular/Umbrella/Tutor Footer - ', () => {
    it.each < {
            type: QaUserKind
        } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }])
        ('$type - GoGuardian, Facebook, LinkedIn, Twitter and YouTube are leading to the correct websites',
            async ({
                type
            }) => {
                const s = await createQaUser(type);

                // connect us
                const pagesNames = ['facebook', 'twitter', 'youtube', 'linkedin'] as
                const;
                for (const name of pagesNames) {
                    const [pagePop] = await Promise.all([
                        s.page.waitForEvent('popup'),
                        s.struct.footer[name].click()
                    ]);

                    // Check url 
                    expect(pagePop.url()).toContain(name);

                    //close the page
                    await pagePop.close();
                }

                // check Logo
                await s.struct.footer.logo.waitForVisible();

                // check zovio link
                const [pageZovio] = await Promise.all([
                    s.page.waitForEvent('popup'),
                    s.struct.footer.company.click()
                ]);

                // Check url and close the page
                expect(pageZovio.url()).toBe('https://www.goguardian.com/');
                await pageZovio.close();

                // student signs out
                await s.struct.header.userTools.username.click();
                await s.struct.userMenu.signOut.click();


            });

});
