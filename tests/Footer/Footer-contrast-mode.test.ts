describe('Visitor/Regular/Umbrella Footer - ', () => {
    it.each < {
            type: QaUserKind
        } > ([{
            type: "student"
        }, {
            type: "studentWithUmbrella"
        }])
        ('$type - High Contrast Mode is working',
            async ({
                type
            }) => {
                const s = await createQaUser(type);

            //background color  
            const pageWeb = await s.page.waitForSelector('#react-app');  
            
            await s.page.keyboard.press('PageDown');

            //switch on
            await s.struct.footer.highContrastMode.waitForVisible();
            await s.struct.footer.highContrastMode.click();

            const bcAfter = await pageWeb.evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('background-color');           
            });
                
            console.log(bcAfter);

            const cAfter = await pageWeb.evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');           
            });

            console.log(cAfter);

            expect(bcAfter).toBe('rgb(255, 255, 255)');               
            expect(cAfter).toBe('rgb(17, 17, 17)'); 

            //switch back
            await s.struct.footer.highContrastMode.waitForVisible();
            await s.struct.footer.highContrastMode.click();

            const bc = await pageWeb.evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('background-color');           
            });

            const c = await pageWeb.evaluate((el) => {
                return window.getComputedStyle(el).getPropertyValue('color');           
            });


            expect(bc).toBe('rgba(0, 0, 0, 0)');               
            expect(c).toBe('rgb(33, 52, 58)'); 

            // sign out
            await s.struct.header.userTools.username.click();
            await s.struct.userMenu.signOut.click();

        });
});

