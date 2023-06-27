
    it("approve tutor account", async () => {
        //create Admin
        const a = await createAdmin();
        // console.log(await a.page.url());  
        // console.log(await (await a.page.waitForSelector('//div[@id="user-tools"]')).innerText());  
        await a.page.waitForTimeout(1000);
        await a.page.keyboard.down('PageDown');

        for (let i = 0; i < 2; i++) {   
            await (await a.page.waitForSelector('//a[contains(text(),"Tutor profiles")]')).click();
            await a.page.waitForTimeout(1000);
    
            const tutors = await a.page.$$('//th/a');
            await tutors[i].click();
    
            await (await a.page.waitForSelector('//a[contains(text(),"Approve")]')).click();
            await a.page.waitForTimeout(2000);
            await a.page.goBack();
          }

        await a.page.close();
    });
