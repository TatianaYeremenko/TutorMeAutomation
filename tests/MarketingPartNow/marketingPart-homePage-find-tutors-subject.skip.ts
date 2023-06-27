describe('Visitor/Regular/Umbrella Home Page - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
        type: "studentWithUmbrella"
    }])(
        '$type - "Find online tutors in any subject" section is available and links are working',
        async ({
            type
        }) => {
            const s = await createQaUser(type);

            //Find online tutors in any subject is visible
            await (await s.page.waitForSelector('//h2[contains(text(),"Find online tutors in any subject")]')).isVisible();

            // subjects
            const subjectNames = ['math', 'history', 'engineering', 'science', 'professional', 'humanities'] as
            const;
            for (const name of subjectNames) {
                await Promise.all([
                    s.page.waitForNavigation({
                        waitUntil: "domcontentloaded",
                        timeout: 30_000
                    }),
                    s.struct.homepage.findSubjects[name].click(),
                ]);

                // check url
                expect(s.page.url()).toBe("https://testing.tutorme.com/" + name + "-tutors/");

                // check the title of the page
                const uppName = name.charAt(0).toUpperCase() + name.slice(1);
                expect(await (await s.page.waitForSelector('h1')).innerText()).toBe("" + uppName + " Tutors");

                // console.log(await (await s.page.waitForSelector('h1')).innerText());
                await s.page.goBack();
            }
            //Computer Science
            await Promise.all([
                s.page.waitForNavigation({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000
                }),
                s.struct.homepage.findSubjects.computerScience.click(),
            ]);
            // check url and title of the page
            expect(s.page.url()).toBe('https://testing.tutorme.com/computer-science-tutors/');
            expect(await (await s.page.waitForSelector('h1')).innerText()).toBe('Computer Science Tutors');
            await s.page.goBack();

            //Foreign Language
            await Promise.all([
                s.page.waitForNavigation({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000
                }),
                s.struct.homepage.findSubjects.foreignLanguage.click(),
            ]);
            // check url and title of the page
            expect(s.page.url()).toBe('https://testing.tutorme.com/foreign-language-tutors/');
            expect(await (await s.page.waitForSelector('h1')).innerText()).toBe('Foreign Language Tutors');
            await s.page.goBack();

            //Test Prep
            await Promise.all([
                s.page.waitForNavigation({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000
                }),
                s.struct.homepage.findSubjects.testPrep.click(),
            ]);
            // check url and title of the page
            expect(s.page.url()).toBe('https://testing.tutorme.com/test-prep-tutors/');
            expect(await (await s.page.waitForSelector('h1')).innerText()).toBe('Test Prep Tutors');
            await s.page.goBack();

            //Social Sciences
            await Promise.all([
                s.page.waitForNavigation({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000
                }),
                s.struct.homepage.findSubjects.socialSciences.click(),
            ]);
            // check url and title of the page
            expect(s.page.url()).toBe('https://testing.tutorme.com/social-sciences-tutors/');
            expect(await (await s.page.waitForSelector('h1')).innerText()).toBe('Social Sciences Tutors');
            await s.page.goBack();

            //click on See all Subjects
            await Promise.all([
                s.page.waitForNavigation({
                    waitUntil: "domcontentloaded",
                    timeout: 30_000
                }),
                s.struct.homepage.findSubjects.seeAll.click(),
            ]);
            // check url and title of the page
            expect(s.page.url()).toBe('https://testing.tutorme.com/subjects/');
            await s.page.goBack();

        });

});