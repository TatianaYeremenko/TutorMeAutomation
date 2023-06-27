describe('Visitor/Regular/Umbrella Demo Lesson Space - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }
    ])(
        '$type - calculator is available and working',
        async ({
            type
        }) => {
            const u = await createQaUser(type);

            //Click on Demo Space
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.demoLessonSpace.click();

            // Click on Calculator
            await u.struct.demoLessonSpace.calculatorButton.click();

            // Enter 789 + 456 =
            const calculation = ['7', '8', '9', 'Plus', '4', '5', '6', 'Enter'] as
            const;
            for (const item of calculation) {
                await u.page.click("[aria-label='" + item + "']");
            }

            // Click the result
            expect(await u.page.locator('//span[contains(text(),"equals 1245")]').innerText()).toBe('equals 1245');
            // console.log(await u.page.locator('//span[contains(text(),"equals 1245")]').allInnerTexts());

            // Clear it
            await u.page.click('text=clear');

            // Check again
            await u.page.click('span:has-text("​")');

            //Close it 
            await u.struct.demoLessonSpace.header.exit.click();

            //Signs out
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.signOut.click();


        });
});