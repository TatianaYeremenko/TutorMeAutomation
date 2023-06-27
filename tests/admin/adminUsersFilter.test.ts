
    it("filter in Users section is working and return the correct result", async () => {
        //create Admin
        const a = await createAdmin(); 
        await a.page.waitForTimeout(1000);
        await a.page.keyboard.down('PageDown');

        // click on Tutoring sessions
        await (await a.page.waitForSelector('//a[contains(text(),"Users")]')).click();
        await a.page.waitForTimeout(1000);

        // type invalid record in filter
        await a.page.fill('//input[@id = "searchbar"]','4231423');
        await a.page.keyboard.press('Enter');
        await a.page.waitForTimeout(1000);
        expect(await (await a.page.waitForSelector('//p[@class="paginator"]')).innerText()).toBe('0 users');

        await (await a.page.waitForSelector('//a[contains(text(),"Show all")]')).click();
        await a.page.waitForTimeout(1000);
        expect(await (await a.page.waitForSelector('//p[@class="paginator"]')).innerText()).toContain('1 2');

        // type the valid record in filter
        await a.page.fill('//input[@id = "searchbar"]','tatiana.v.yeremenko');
        await a.page.keyboard.press('Enter');
        await a.page.waitForTimeout(1000);
        expect(await (await a.page.waitForSelector('//p[@class="paginator"]')).innerText()).toContain('1 2');

        await a.page.close();
    });
