
    it("create admin account", async () => {
        //create Admin
        const a = await createAdmin();
        console.log(await a.page.url());  
        console.log(await (await a.page.waitForSelector('//div[@id="user-tools"]')).innerText());  
        await a.page.waitForTimeout(1000);
        await a.page.keyboard.down('PageDown');

        await (await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')).click();
        await a.page.waitForTimeout(1000);

        await (await a.page.waitForSelector('//a[contains(text(),"Approved")]')).click();
        await a.page.waitForTimeout(1000);

        const tutors = await a.page.$$('//th/a');
        await tutors[5].click();

        await a.page.waitForTimeout(1000);


        await a.page.keyboard.down('PageDown');
        await a.page.keyboard.down('PageDown');

        await a.page.selectOption('#id_force_writing_lab', 'False');
        await a.page.waitForTimeout(3000);

        await a.page.keyboard.down('PageUp');
        await a.page.keyboard.down('PageUp');

        await (await a.page.waitForSelector('//a[contains(text(),"Login as")]')).click();


        await a.page.waitForTimeout(3000);


                       

        //tutor signs out
        // await (await t.page.waitForSelector('//a[contains(text(),"Log out")]')).click();
    });
