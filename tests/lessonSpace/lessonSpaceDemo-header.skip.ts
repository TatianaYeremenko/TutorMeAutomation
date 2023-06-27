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

            // check the logo
            await u.struct.demoLessonSpace.header.logo.waitForVisible();

            // check the title
            expect(await u.struct.demoLessonSpace.header.title.text()).toBe('Demo Lesson Space: Whiteboard');

            // click on Timer
            await u.struct.demoLessonSpace.header.timerToggle.click();
            await u.struct.demoLessonSpace.header.timerDisplay.waitForVisible();
      
            //check the timer
            function timeValidation(strTime: string) {
                var timeFormat = /^\d?\d:\d{2}:\d{2}$/;
                return timeFormat.test(strTime);
            }
            timeValidation(await u.struct.demoLessonSpace.header.timerDisplay.text());

            //click on Support lesson and then close it
            await u.struct.demoLessonSpace.header.support.waitForVisible();
            await u.struct.demoLessonSpace.header.support.click();

            await u.struct.demoLessonSpace.header.support.click();

            await u.page.reload();

            //Close it 
            await u.struct.demoLessonSpace.header.exit.waitForVisible();
            await u.struct.demoLessonSpace.header.exit.click();

            //Signs out
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.signOut.click();

        });
});