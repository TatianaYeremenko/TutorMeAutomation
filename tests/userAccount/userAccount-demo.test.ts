it.each < {
    type: QaUserKind
} > ([{
    type: "studentWithUmbrella"
}, {
    type: "student"
}])(
    '$type - Help Center is available and Search is working',
    async ({
        type
    }) => {
        const { struct, page, user } = await createQaUser(type);

        //click on Help Center
        await struct.header.userTools.openMenu.click();
        await struct.userMenu.helpCenter.waitForVisible();

        const [pageHelp] = await Promise.all([
            page.waitForEvent('popup'),
            struct.userMenu.helpCenter.click(),
        ]);
        expect(pageHelp.url()).toBe('https://help.tutor.peardeck.com/en/');

        //close page
        await pageHelp.close();
        
        //click on my Account and Sign Out
        await struct.header.userTools.openMenu.click();
        await struct.userMenu.signOut.click();
  });
  
