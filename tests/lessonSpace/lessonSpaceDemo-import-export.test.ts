describe('Visitor/Regular/Umbrella Demo Lesson Space - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }
    ])(
        '$type - Full Screen, PDF Export and Import are there and working',
        async ({
            type
        }) => {
            const u = await createQaUser(type);

            //Click on Demo Space
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.demoLessonSpace.click();

            //click on Whiteboard
            await u.struct.demoLessonSpace.whiteboardButton.click();

            //click on import
            await u.struct.demoLessonSpace.whiteboard.import.click();

            //click on export
            await u.struct.demoLessonSpace.whiteboard.export.export.click();
            await u.struct.demoLessonSpace.whiteboard.export.all.click();

            //click on fullscreen
            await u.struct.demoLessonSpace.fullScreen.click();

            //click on share switch
            await u.struct.demoLessonSpace.screenShareSwitch.click();
            await u.struct.demoLessonSpace.screenShareSwitch.click();

            await u.struct.demoLessonSpace.header.exit.click();

            //Signs out
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.signOut.click();


        });
});