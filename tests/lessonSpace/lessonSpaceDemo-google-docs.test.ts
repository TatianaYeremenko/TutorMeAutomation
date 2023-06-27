describe('Visitor/Regular/Umbrella Demo Lesson Space - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }
    ])(
        '$type - google docs are available and opening',
        async ({
            type
        }) => {
            const u = await createQaUser(type);

        //Click on Demo Space
        await u.struct.header.userTools.username.click();
        await u.struct.userMenu.demoLessonSpace.click();

        // Click on Calculator
        await u.struct.demoLessonSpace.google.click();

        // open Google Doc
        const [pageDoc] = await Promise.all([
            u.page.waitForEvent('popup'),
            u.struct.demoLessonSpace.googleDocs.docs.launch.click()
        ]);               
        // Check url
        expect(pageDoc.url()).toContain('docs.google.com/document');

        // open Google Spread Sheet
        const [pageSheet] = await Promise.all([
            u.page.waitForEvent('popup'),
            u.struct.demoLessonSpace.googleDocs.sheets.launch.click()
        ]);               
        // Check url
        expect(pageSheet.url()).toContain('docs.google.com/spreadsheets');
 
        // open Google Presentation
        const [pagePres] = await Promise.all([
            u.page.waitForEvent('popup'),
            u.struct.demoLessonSpace.googleDocs.slides.launch.click()
        ]);               
        // Check url
        expect(pagePres.url()).toContain('docs.google.com/presentation');
        
        // close all pages
        pageDoc.close();
        pageSheet.close();
        pagePres.close();

        await u.struct.demoLessonSpace.header.exit.click();

        //Signs out
        await u.struct.header.userTools.username.click();
        await u.struct.userMenu.signOut.click();       

    });
});