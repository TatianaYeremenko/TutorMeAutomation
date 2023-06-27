import faker, {
    random
  } from "faker";
it.each < {
    type: QaUserKind
} > ([{
    type: "studentWithUmbrella"
}, {
    type: "student"
}])(
    '$type - Demo Lesson Space is available for user to try it on',
    async ({
        type
    }) => {
        const { struct, page, user } = await createQaUser(type);

        //click on my Demo Lesson Space
        await struct.header.userTools.avatar.click();
        await struct.userMenu.demoLessonSpace.waitForVisible();
        await struct.userMenu.demoLessonSpace.click();

        //check the header on the top
        await page.waitForLoadState('domcontentloaded'); // The promise resolves after 'domcontentloaded' event.
        expect(await struct.demoLessonSpace.header.title.text()).toBe('Demo Lesson Space: Whiteboard');
        // console.log(await struct.demoLessonSpace.header.title.text());

        // exit
        await struct.demoLessonSpace.header.exit.waitForVisible();
        await struct.demoLessonSpace.header.exit.click();
        

        //click on my Account and Sign Out
        await struct.header.userTools.avatar.click();
        await struct.userMenu.signOut.click();
  
  });
  
