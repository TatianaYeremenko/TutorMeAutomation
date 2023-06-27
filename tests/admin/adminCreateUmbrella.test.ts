import faker from "faker";
it("New Umbrella Account is created and edited successfully", async () => {
        //create Admin
        const a = await createAdmin(); 
        await a.page.waitForTimeout(1000);
        await a.page.keyboard.down('PageDown');

        // click on Tutoring sessions
        await (await a.page.waitForSelector('//a[contains(text(),"Umbrella accounts")]')).click();
        await a.page.waitForTimeout(1000);

        // click on Add Link
        await (await a.page.waitForSelector('//a[contains(text(),"Add umbrella account")]')).click();

        // enter Name
        let umbrellaName = faker.company.companyName();
        await (await a.page.waitForSelector('//input[@id="id_name"]')).fill(umbrellaName.replace(/[^A-Z0-9]/ig,''))
        let umbrellaId = umbrellaName.replace(/[^A-Z0-9]/ig, "");
        console.log(umbrellaId);
        await a.page.waitForTimeout(200);

        // enter NameCompany
        await (await a.page.waitForSelector('//input[@id="id_display_name"]')).fill(umbrellaName);
        await a.page.waitForTimeout(200);
        console.log(umbrellaName);

        // enter Billing
        await a.page.selectOption('#id_billing_mode', '3');
        await a.page.waitForTimeout(200);

        // await a.page.keyboard.press('PageDown');

        // click on Save
        await (await a.page.waitForSelector('//input[@name="_save"]')).click();
        await a.page.waitForTimeout(200);

        // check error message
        expect(await (await a.page.waitForSelector('//p[@class="errornote"]')).innerText()).toBe('Please correct the error below.');
    
        // click on No Expiration
        await (await a.page.waitForSelector('//input[@id="no-expiration"]')).check();
        await a.page.waitForTimeout(200);

        // click on Save again
        await (await a.page.waitForSelector('//input[@name="_save"]')).click();
        await a.page.waitForTimeout(200);

        //  umbrella is created
        expect(await (await a.page.waitForSelector('//li[@class="success"]')).innerText()).toContain('The umbrella account “'+ umbrellaId + '” was added successfully.');
        await a.page.waitForTimeout(200);

        // type invalid record in filter
        await a.page.fill('//input[@id = "searchbar"]',umbrellaId);
        await a.page.keyboard.press('Enter');
        await a.page.waitForTimeout(200);
        expect(await (await a.page.waitForSelector('//p[@class="paginator"]')).innerText()).toBe('1 umbrella account');

        //edit the umbrella
        let umbrellas = await a.page.$$("//th/a");
        await umbrellas[0].click();

        // add number of students
        await (await a.page.waitForSelector('//input[@id="id_active_seats"]')).fill('100');
        await a.page.waitForTimeout(200);

        // click on Save again and check the message
        await (await a.page.waitForSelector('//input[@name="_save"]')).click();
        await a.page.waitForTimeout(200); 
        expect(await (await a.page.waitForSelector('//li[@class="success"]')).innerText()).toContain('The umbrella account “'+ umbrellaId + '” was changed successfully.');
        await a.page.waitForTimeout(200);  

        await a.page.waitForTimeout(2000);

        // log out
        await (await a.page.waitForSelector('//a[contains(text(),"Log out")]')).click();
        await a.page.waitForTimeout(200);

        // await a.page.close();
    });
