
    it("user can switch between Tutor Mode and Student Mode", async () => {
  
        //create Tutor
        const t = await createQaUser('tutor');
        
        // check the page header
        expect(await t.page.locator('h1').innerText()).toBe('Tutor Interface'); 
        // console.log(await t.page.locator('h1').innerText()); 

        await t.struct.header.userTools.avatar.click();
        await t.struct.userMenu.switchTooltip.waitForVisible();
        expect(await t.struct.userMenu.switchTooltip.text()).toBe('?When turned off, you are in student mode and can receive tutoring.');

        //switch to Student Switch
        await t.struct.userMenu.switch.click();
        await t.page.waitForTimeout(1000);

        // check the page header
        expect(await t.page.locator('h1').innerText()).toBe('On-demand online tutoring'); 
        // console.log(await t.page.locator('h1').innerText()); 

         //switch back to Tutor Switch
        await t.struct.header.userTools.avatar.click();       
        await t.struct.userMenu.switch.click();
        await t.page.waitForTimeout(1000);

        // check the page header
        expect(await t.page.locator('h1').innerText()).toBe('Tutor Interface'); 
        // console.log(await t.page.locator('h1').innerText()); 

        //tutor signs out
        await t.struct.header.userTools.username.click();
        await t.struct.userMenu.signOut.click();
  
    });
