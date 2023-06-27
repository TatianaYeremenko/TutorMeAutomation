describe('Visitor/Regular/Umbrella Demo Lesson Space - ', () => {
    it.each < {
        type: QaUserKind
    } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }
    ])(
        '$type - Text Editor is available and all text editor features are working including LaTex',
        async ({
            type
        }) => {
            const u = await createQaUser(type);

             //Click on Demo Space
             await u.struct.header.userTools.username.click();
             await u.struct.userMenu.demoLessonSpace.click();
 
            // Click on Text Editor
            await u.struct.demoLessonSpace.textEditorButton.click();

            // Click on Text 
            for (const i of [12, 14, 18, 24]) {
                await u.struct.demoLessonSpace.textEditor.fontSize.selectBase.click();
                await u.struct.demoLessonSpace.textEditor.fontSize.item(i).click();
            }
            //Select color
            await u.struct.demoLessonSpace.textEditor.fontColor.selectBase.click();
            // await u.struct.demoLessonSpace.textEditor.fontColor.item(1).click();

            // Click on each
            const textEditButtons = [
                'bold', 'italic', 'underline', 'strike', 'highlight', 'orderedList', 'unorderedList', 
                'todoList', 'leftAlign', 'centerAlign', 'rightAlign', 'indent', 'unindent', 'undo', 'redo'] as const;
            for (const item of textEditButtons) {
                await u.struct.demoLessonSpace.textEditor[item].click();
                await u.struct.demoLessonSpace.textEditor[item].click();
            }
            await u.struct.demoLessonSpace.textEditor.todoList.click();


            //check accessibility module
            await u.struct.demoLessonSpace.textEditor.accessibility.click();
            await u.struct.modals.textEditorAccessibility.waitForVisible();
            await u.struct.modals.textEditorAccessibility.content.close.click();

            //check LATEX
            await u.struct.demoLessonSpace.textEditor.latex.button.click();
            await u.struct.demoLessonSpace.textEditor.latex.textArea.type('2^2');
            await u.struct.demoLessonSpace.textEditor.latex.apply.click();
            // console.log(await u.struct.demoLessonSpace.textEditor.textArea.text());
            expect(await u.struct.demoLessonSpace.textEditor.textArea.text()).toContain('2Powered');
            await u.page.waitForTimeout(200);
    

            //Close it 
            await u.struct.demoLessonSpace.header.exit.click();

            //Signs out
            await u.struct.header.userTools.username.click();
            await u.struct.userMenu.signOut.click();


        });

});